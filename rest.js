const { ObjectId } = require("mongodb");

async function selectUserMessages(collection, req, res) {
    if (collection) {
        const query = generateQueryString(req);
        const findResult = await collection.find({ $or: [{ id: query.id, receiverId: query.receiverId }, { id: query.receiverId, receiverId: query.id }]}).toArray();
        if(findResult.length)
            res.send({statusCode:200,data:JSON.stringify(findResult)})
        else
            res.send({statusCode: 200, data: JSON.stringify([])})
    } else
        res.send({statusCode:500,message:"500 internal server error"})
}

async function removeMessages(collection, req, res) {
    if (collection) {
        const findResult = await collection.deleteMany(generateQueryString(req)).toArray();
        res.send({ statusCode: 200, data: JSON.stringify(findResult)})
    } else
        res.send({statusCode:500,message:"500 internal server error"})
}

async function selectAll(collection, req, res) {
    if (collection) {
        const findResult = await collection.find(generateQueryString(req)).toArray();
        if(findResult.length)
            res.send({statusCode:200,data:JSON.stringify(findResult)})
        else
            res.send({ statusCode: 500, message: "User not found" })
    } else
        res.send({statusCode:500,message:"500 internal server error"})
}

async function selectById(collection, req, res) {
    if (collection) {
        const queryString = generateQueryString(req);
        const findResult = await collection.find({"_id":new ObjectId(queryString.id)}).toArray();
        if(findResult.length)
            res.send({statusCode:200,data:JSON.stringify(findResult)})
        else
            res.send({ statusCode: 500, message: "User not found" })
    } else
        res.send({statusCode:500,message:"500 internal server error"})
}

async function insertRecord(collection, req, res) {
    if (collection) {
        if (Object.keys(generateQueryString(req)).length) {
            const findResult = await collection.find(generateQueryString(req)).toArray();
            if (!findResult.length) {
                const findResult = await collection.insertOne(generateQueryString(req));
                res.send({statusCode:200,data:JSON.stringify(findResult)})
            }else{
                res.send({ statusCode: 500, message: "User already exists" })
            }
        } else {
            res.send({ statusCode: 500, message: "Request values should not be empty" })
        }
    } else
        res.send({statusCode:500,message:"500 internal server error"})
}

async function updateRecord(collection, req, res) {
    if (collection) {
        if (Object.keys(generateQueryString(req)).length) {
            let queryString = generateQueryString(req);
            let id = ""
            if (queryString._id) {
                id = ObjectId(queryString._id);
                delete queryString['_id'];
            }
            const findResult = await collection.updateOne({ _id: id }, { $set: queryString });
            res.send({statusCode:200,data:JSON.stringify(findResult)})
        } else {
            res.send({ statusCode: 500, message: "Request values should not be empty" })
        }
    }
}

async function deleteRecord(collection, req, res) {
    if (collection) {
        let queryString = generateQueryString(req);
        if (queryString._id) {
            queryString._id = ObjectId(queryString._id);
        }
        const findResult = await collection.deleteMany(queryString);
        res.send({statusCode:200,data:JSON.stringify(findResult)})
    }
}

function generateQueryString(req) {
    let queryString = {};

    if (req.query && req.method == "GET") {
        queryString = req.query;
    }
    if (req.body && req.method == "POST") {
        queryString = req.body;
    }
    return queryString;
}

module.exports = {
    selectAll,
    insertRecord,
    updateRecord,
    deleteRecord,
    generateQueryString,
    selectById,
    selectUserMessages,
    removeMessages
}