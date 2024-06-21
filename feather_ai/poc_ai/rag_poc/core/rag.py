from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader

class RAG:
  EMBEDDING_MODEL = "models/embedding-001"
  def __init__(self,index_name):
    self.embeddings = GoogleGenerativeAIEmbeddings(model=self.EMBEDDING_MODEL)
    self.index_name = index_name

  def load(self,document_path):
    loader = PyPDFLoader(document_path)
    docs = loader.load_and_split()
    return docs
  
  def store(self,docs):  
    PineconeVectorStore.from_documents(docs, self.embeddings, index_name=self.index_name)

  def search(self,user_query):
    vectorstore = PineconeVectorStore(index_name=self.index_name, embedding=self.embeddings)
    docs = vectorstore.similarity_search(user_query,k=2)# k number of chunks
    knowledge = ""
    for doc in docs:
      knowledge+=doc.page_content
    return knowledge