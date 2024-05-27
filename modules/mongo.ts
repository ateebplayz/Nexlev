import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import { Job, User } from './types'
dotenv.config()

export const mongoClient = new MongoClient(process.env.MONGOURL || '')

export const db = mongoClient.db('DBName')

export const collections = {
    verifiedJobs: db.collection<Job>("VerifiedJobs"),
    unverifiedJobs: db.collection<Job>("UnverifiedJobs"),
    users: db.collection<User>("Users")
}