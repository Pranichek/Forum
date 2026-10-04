export interface Post {
  id: number            
  title: string         
  content: string      
  author?: string | null    
  category?: string | null  
}