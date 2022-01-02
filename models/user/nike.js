const db =require('../db');

exports.priceForShow = function(price) {
    price = parseInt(price);
    return String(price).replace(/(.)(?=(\d{3})+$)/g,'$1,');
}

exports.getAllNike = async () =>{
    const pds = await db.query('select * from shoes where brand_id = 1')

    return pds.rows;
}