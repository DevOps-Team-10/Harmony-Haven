const createProduct = async(req,res)=>{
   return res.status(200).json({message:'product created successfully'})
}

module.exports={
    createProduct
}