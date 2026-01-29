const express = require("express")
const router = express.Router()
const Product = require("../models/Product.js")

const isAdmin=(req,res,next)=>{
    const {role}=req.body
    if(role!="admin")
        return res.status(403).json({"message":"Access denied, admin only"})
    next()  
}

router.post("/add",isAdmin,async (req,res)=>{ 
    try{
        const {name,price,description,category,stock}=req.body
        const newproduct=new Product({
            name,price,description,category,stock
        })
        await newproduct.save()
        return res.status(200).json({"message":"Product added successfully"})
    }
    catch(err){
        console.log("error from adding product",err)
    }
})

router.get("/",async(req,res)=>{
    try{
        const products=await Product.find()
        res.status(200).json(products)
    }
    catch(err){
        console.log("error while fetching the products",err)
        res.status(500).json({"message":"Error while fetching the products"})
    }
})

module.exports=router