const db =require('../db');


exports.getAllProducts = async () =>{
    const pds = await db.query('select * from shoes')
    return pds.rows;
}