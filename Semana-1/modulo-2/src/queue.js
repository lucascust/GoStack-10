/**
 * File to separate queues from application
 */
import 'dotenv/config';
import Queue from './lib/Queue';

Queue.processQueue();
