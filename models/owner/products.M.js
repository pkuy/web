const db =require('../db');


exports.getAllProducts = async () =>{
    const pds = await db.query('select * from shoes')
    return pds.rows;
}
exports.priceForShow = function(price) {
    price = parseInt(price);
    return String(price).replace(/(.)(?=(\d{3})+$)/g,'$1,');
}