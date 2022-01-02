const db =require('../db');

exports.getAllAdidas = async () =>{
    const pds = await db.query('select * from shoes where brand_id = 2')

    return pds.rows;
}