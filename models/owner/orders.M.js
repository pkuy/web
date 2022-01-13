const db =require('../db');


exports.getOrders = async () =>{
    const pds = await db.query('select orders.order_id,users.username,orders.total,orders.order_time,orders.address,orders.status from orders, users where orders.user_id = users.user_id')
    return pds.rows;
}