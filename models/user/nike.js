const db =require('../db');

exports.getAllNike = async () =>{
    const pds = await db.query('select * from shoes where brand_id = 1')

    return pds.rows;
}