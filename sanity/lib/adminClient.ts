import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

// Create a client with a preview token
export const adminClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_ADMIN_TOKEN,
  useCdn: false, // We need to use the API directly for writes, no CDN
})
