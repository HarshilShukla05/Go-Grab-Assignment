// database.js
import * as SQLite from 'expo-sqlite';

// Open or create the SQLite database
const db = SQLite.openDatabase('todoList.db');

// Create tables for groups and todos
export const createTables = () => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS groups (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         name TEXT NOT NULL
       );`,
            [],
            () => console.log('Groups table created successfully'),
            (tx, error) => console.log('Error creating groups table', error)
        );

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS todos (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         title TEXT NOT NULL,
         description TEXT,
         completed BOOLEAN NOT NULL CHECK (completed IN (0, 1)),
         groupId INTEGER NOT NULL,
         FOREIGN KEY(groupId) REFERENCES groups(id)
       );`,
            [],
            () => console.log('Todos table created successfully'),
            (tx, error) => console.log('Error creating todos table', error)
        );
    });
};

export default db;
