db = db.getSiblingDB("service_catalog");

db.createCollection("service_categories");
db.createCollection("services");
db.createCollection("category_templates");

db = db.getSiblingDB("admin");

db.createUser({
    user: "userAdmin",
    pwd: "userAdminPassword",
    roles: [{ role: "userAdminAnyDatabase", db: "admin" }]
});

db.createUser({
    user: "dbOwner",
    pwd: "dbOwnerPassword",
    roles: [{ role: "dbOwner", db: "service_catalog" }]
});

db.createUser({
    user: "rwUser",
    pwd: "rwUserPassword",
    roles: [{ role: "readWrite", db: "service_catalog" }]
});