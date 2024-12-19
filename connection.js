const mysql = require("mysql");

// Create a connection to the MySQL server (without specifying the database yet)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err.message);
        return;
    }
    console.log("Connected to MySQL");

    // Create `Hostels` database if it doesn't exist
    db.query("CREATE DATABASE IF NOT EXISTS Hostels", (err) => {
        if (err) {
            console.error("Error creating database:", err.message);
            return;
        }
        // Switch to the `Hostels` database
        db.changeUser({ database: 'Hostels' }, (err) => {
            if (err) {
                console.error("Error switching to Hostels database:", err.message);
                return;
            }

            // Create the `hostels` table if it doesn't exist
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS hostels (
                    hostel_id INT PRIMARY KEY AUTO_INCREMENT,
                    name VARCHAR(100) NOT NULL,
                    latitude DECIMAL(10, 8) NOT NULL,
                    longitude DECIMAL(11, 8) NOT NULL,
                    contact_number VARCHAR(15),
                    address VARCHAR(50),
                    monthly_rent DECIMAL(10, 2) NOT NULL,
                    gender INT,
                    wifi INT,
                    gym INT,
                    mess INT,
                    laundry INT
                );
            `;

            db.query(createTableQuery, (err) => {
                if (err) {
                    console.error("Error creating hostels table:", err.message);
                    return;
                }
            });
        });
    });
});

// Export the database connection for use in other files
module.exports = db;
