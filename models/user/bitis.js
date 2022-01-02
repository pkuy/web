const db =require('../db');

exports.getAllBitis = async () =>{
    const pds = await db.query('select * from shoes where brand_id = 3')

    return pds.rows;
}