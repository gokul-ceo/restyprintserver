import { createServer } from "http";

import { Server } from "socket.io";
const httpserver = createServer()
const io = new Server(httpserver)
const express = require('express');
const cors = require('cors');


const app = express();
app.use(cors())

const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

let printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: 'tcp://192.168.1.87:9100'
});
interface datatoprint{
        orderid:string,
        time:string | any,
        date:string | any,
        orderdetails:string | any,
        total:number | string,
}
async function printData(data:datatoprint) {
    try {
      printer.alignCenter();
     
      printer.bold(true);
      printer.setTextSize(1,0);  
      printer.underlineThick(true);  
      printer.println("Sri Saravana");
      printer.setTextNormal();
      printer.underlineThick(false);
      printer.bold(true);
      printer.println("veg restuarent")
      printer.println("Nh service road, Melmaruvathur - 603319 ")
      printer.bold(false);
      printer.setTextNormal(); 
      printer.drawLine();
      printer.alignLeft();
      printer.tableCustom([
        { text: `Order ID: ${data.orderid}`, align: 'LEFT', width: 0.5 },
        { text: `Date: ${data.date}`, align: 'RIGHT', width: 0.5 },
        { text: `Time: ${data.time}`, align: 'LEFT', width: 0.5 }
      ]);
  
      printer.drawLine();
      printer.alignLeft();
      printer.tableCustom([
        { text: 'Menu', align: 'LEFT', width: 0.35 },
        { text: 'Quantity', align: 'CENTER', width: 0.2 },
        { text: 'Price', align: 'CENTER', width: 0.2 },
        { text: 'Total', align: 'CENTER', width: 0.25 }
      ]);
      printer.drawLine();
      data.orderdetails.forEach((orderItem: { menuname: any; quantity: number; price: number; }) => {
        printer.tableCustom([
          { text: orderItem.menuname, align: 'LEFT', width: 0.35 },
          { text: orderItem.quantity.toString(), align: 'CENTER', width: 0.2 },
          { text: orderItem.price.toString(), align: 'CENTER', width: 0.2 },
          { text: (orderItem.quantity * orderItem.price).toString(), align: 'CENTER', width: 0.25 }
        ]);
      });
    // added a comment
      printer.drawLine();
      printer.alignRight(); 
      printer.bold(true);
      printer.println(`Total: ${data.total}`);
      printer.bold(false);
      printer.alignCenter();
      printer.drawLine();
      printer.println('Thanks for visiting');
      printer.cut();
  
      await printer.execute();
      console.log('Print completed successfully!');
    } catch (error) {
      console.log('Print failed:', error);
    } finally {
      printer.clear();
    }
  }

io.on('connection',(socket)=>{
    console.log('connection established')

    socket.on('disconnect',()=>{
        console.log('disconnected')
    })
    socket.on('data',(data)=>{
        printData(data)
    })

  
})


httpserver.listen(5000,()=>{
    console.log('listening on *:5000')
})