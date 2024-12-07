import { SQLiteDatabase } from "expo-sqlite";
import * as FileSystem from 'expo-file-system';
import { Chat, Message, Role } from "./interfaces";
export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    console.log(FileSystem.documentDirectory);
    const DATABASE_VERSION = 1;
    let result = await db.getFirstAsync<{user_version: number}>('PRAGMA user_version');
    let currentDbVersion = result?.user_version ?? 0;

    if (currentDbVersion >= DATABASE_VERSION) {
        console.log('ALREADY ON LATEST DB')
      return;
    }

    if (currentDbVersion === 0) {
      const result = await db.execAsync(`
  PRAGMA journal_mode = 'wal';
  CREATE TABLE chats (
  id INTEGER PRIMARY KEY NOT NULL, 
  title TEXT NOT NULL
  );
  
  CREATE TABLE messages (
    id INTEGER PRIMARY KEY NOT NULL, 
    chat_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    role TEXT,
    FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
  );
  `);
      console.log(result);
      currentDbVersion = 1;
    }
    // if (currentDbVersion === 1) {
    //   Add more migrations
    // }
    return await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  }

  export const addChat = async (db: SQLiteDatabase, title:string)=> {
    return await db.runAsync('INSERT INTO chats (title) VALUES (?)',title);
  }

  export const getChats = async (db: SQLiteDatabase) => {
    return await db.getAllAsync<Chat>('SELECT * FROM chats')
  }


  export const getMessages = async (db: SQLiteDatabase, chatId: number): Promise<Message[]> => {
    return (await db.getAllAsync<Message>('SELECT * FROM messages WHERE chat_id = ?', chatId)).map(
      (message) => ({
        ...message,
        role: '' + message.role === 'bot' ? Role.Bot : Role.User,
      })
    );
  };
  
  export const addMessage = async (
    db: SQLiteDatabase,
    chatId: number,
    { content, role }: Message
  ) => {
    return await db.runAsync(
      'INSERT INTO messages (chat_id, content, role) VALUES (?, ?, ?)',
      chatId,
      content,
      role === Role.Bot ? 'bot' : 'user',
    );
  };
  
  export const deleteChat = async (db: SQLiteDatabase, chatId: number) => {
    return await db.runAsync('DELETE FROM chats WHERE id = ?', chatId);
  };
  
  export const renameChat = async (db: SQLiteDatabase, chatId: number, title: string) => {
    return await db.runAsync('UPDATE chats SET title = ? WHERE id = ?', title, chatId);
  };