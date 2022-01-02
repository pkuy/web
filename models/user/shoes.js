const db =require('../db');

exports.getShoes = async (id) =>{
    const pds = await db.query('select * from shoes where shoes_id = ' + id)

    return pds.rows[0];
}