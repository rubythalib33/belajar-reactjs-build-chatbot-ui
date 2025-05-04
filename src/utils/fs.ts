/**
 * This is a browser-based file system utility that simulates file operations
 * using localStorage since browsers can't directly write to the file system.
 */

/**
 * Generic function to read a JSON file
 */
export async function readJsonFile<T>(filePath: string): Promise<T> {
    try {
      // Try to read from localStorage first
      const localData = localStorage.getItem(`file_${filePath}`);
      
      if (localData) {
        return JSON.parse(localData) as T;
      }
      
      // If not in localStorage, fetch from public directory
      const response = await fetch(filePath);
      
      if (!response.ok) {
        throw new Error(`Failed to read file: ${filePath}`);
      }
      
      const data = await response.json() as T;
      // Store this initial data in localStorage for future use
      localStorage.setItem(`file_${filePath}`, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return [] as unknown as T; // Return empty array as default for collections
    }
  }
  
  /**
   * Generic function to write to a JSON file
   * Note: This is using localStorage since browsers can't write to the file system.
   */
  export async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
    try {
      // In a real app, you would send data to a server
      // For this demo, we're using localStorage with a consistent key pattern
      localStorage.setItem(`file_${filePath}`, JSON.stringify(data));
      console.log(`Data saved for ${filePath}`);
    } catch (error) {
      console.error(`Error writing to file ${filePath}:`, error);
      throw error;
    }
  }