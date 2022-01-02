const pool = require('../db');
const tableName = "public.carts";


const addOneCarts = async(idUser) => {

    const data = await pool.query(`
    INSERT INTO ${tableName}
    ("user_id")
    VALUES ('${idUser}')
    RETURNING *`);

    return data.rows;
}

module.exports = addOneCarts;