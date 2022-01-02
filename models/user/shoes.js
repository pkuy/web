const db =require('../db');

exports.priceForShow = function(price) {
    price = parseInt(price);
    return String(price).replace(/(.)(?=(\d{3})+$)/g,'$1,');
}

exports.getShoes = async (id) =>{
    const pds = await db.query('select * from shoes where shoes_id = ' + id)

    return pds.rows[0];
}