import axios from 'axios';

const API_URL = '/api';

class ContractService {
  // Get all contracts with optional filters
  async getContracts(filters = {}) {
    try {
      const response = await axios.get(`${API_URL}/contracts`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    }
  }

  // Get a single contract by ID
  async getContract(id) {
    try {
      const response = await axios.get(`${API_URL}/contracts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contract ${id}:`, error);
      throw error;
    }
  }

  // Create a new contract
  async createContract(contractData) {
    try {
      const response = await axios.post(`${API_URL}/contracts`, contractData);
      return response.data;
    } catch (error) {
      console.error('Error creating contract:', error);
      throw error;
    }
  }

  // Update an existing contract
  async updateContract(id, contractData) {
    try {
      const response = await axios.put(`${API_URL}/contracts/${id}`, contractData);
      return response.data;
    } catch (error) {
      console.error(`Error updating contract ${id}:`, error);
      throw error;
    }
  }

  // Delete a contract
  async deleteContract(id) {
    try {
      const response = await axios.delete(`${API_URL}/contracts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting contract ${id}:`, error);
      throw error;
    }
  }

  // Update contract status
  async updateContractStatus(id, status) {
    try {
      const response = await axios.patch(`${API_URL}/contracts/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating contract ${id} status:`, error);
      throw error;
    }
  }

  // Get contract parties
  async getContractParties(contractId) {
    try {
      const response = await axios.get(`${API_URL}/contracts/${contractId}/parties`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching parties for contract ${contractId}:`, error);
      throw error;
    }
  }

  // Add contract party
  async addContractParty(contractId, partyData) {
    try {
      const response = await axios.post(`${API_URL}/contracts/${contractId}/parties`, partyData);
      return response.data;
    } catch (error) {
      console.error(`Error adding party to contract ${contractId}:`, error);
      throw error;
    }
  }

  // Update contract party
  async updateContractParty(contractId, partyId, partyData) {
    try {
      const response = await axios.put(`${API_URL}/contracts/${contractId}/parties/${partyId}`, partyData);
      return response.data;
    } catch (error) {
      console.error(`Error updating party ${partyId} for contract ${contractId}:`, error);
      throw error;
    }
  }

  // Delete contract party
  async deleteContractParty(contractId, partyId) {
    try {
      const response = await axios.delete(`${API_URL}/contracts/${contractId}/parties/${partyId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting party ${partyId} from contract ${contractId}:`, error);
      throw error;
    }
  }

  // Get contract sections
  async getContractSections(contractId) {
    try {
      const response = await axios.get(`${API_URL}/contracts/${contractId}/sections`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sections for contract ${contractId}:`, error);
      throw error;
    }
  }

  // Add contract section
  async addContractSection(contractId, sectionData) {
    try {
      const response = await axios.post(`${API_URL}/contracts/${contractId}/sections`, sectionData);
      return response.data;
    } catch (error) {
      console.error(`Error adding section to contract ${contractId}:`, error);
      throw error;
    }
  }

  // Update contract section
  async updateContractSection(contractId, sectionId, sectionData) {
    try {
      const response = await axios.put(`${API_URL}/contracts/${contractId}/sections/${sectionId}`, sectionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating section ${sectionId} for contract ${contractId}:`, error);
      throw error;
    }
  }

  // Delete contract section
  async deleteContractSection(contractId, sectionId) {
    try {
      const response = await axios.delete(`${API_URL}/contracts/${contractId}/sections/${sectionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting section ${sectionId} from contract ${contractId}:`, error);
      throw error;
    }
  }

  // Get contract clauses
  async getContractClauses(contractId, sectionId) {
    try {
      const response = await axios.get(`${API_URL}/contracts/${contractId}/sections/${sectionId}/clauses`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching clauses for section ${sectionId} in contract ${contractId}:`, error);
      throw error;
    }
  }

  // Add contract clause
  async addContractClause(contractId, sectionId, clauseData) {
    try {
      const response = await axios.post(`${API_URL}/contracts/${contractId}/sections/${sectionId}/clauses`, clauseData);
      return response.data;
    } catch (error) {
      console.error(`Error adding clause to section ${sectionId} in contract ${contractId}:`, error);
      throw error;
    }
  }

  // Update contract clause
  async updateContractClause(contractId, sectionId, clauseId, clauseData) {
    try {
      const response = await axios.put(`${API_URL}/contracts/${contractId}/sections/${sectionId}/clauses/${clauseId}`, clauseData);
      return response.data;
    } catch (error) {
      console.error(`Error updating clause ${clauseId} in section ${sectionId} for contract ${contractId}:`, error);
      throw error;
    }
  }

  // Delete contract clause
  async deleteContractClause(contractId, sectionId, clauseId) {
    try {
      const response = await axios.delete(`${API_URL}/contracts/${contractId}/sections/${sectionId}/clauses/${clauseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting clause ${clauseId} from section ${sectionId} in contract ${contractId}:`, error);
      throw error;
    }
  }

  // Get contract documents
  async getContractDocuments(contractId) {
    try {
      const response = await axios.get(`${API_URL}/contracts/${contractId}/documents`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching documents for contract ${contractId}:`, error);
      throw error;
    }
  }

  // Upload contract document
  async uploadContractDocument(contractId, formData) {
    try {
      const response = await axios.post(`${API_URL}/contracts/${contractId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error uploading document to contract ${contractId}:`, error);
      throw error;
    }
  }

  // Update contract document
  async updateContractDocument(contractId, documentId, documentData) {
    try {
      const response = await axios.put(`${API_URL}/contracts/${contractId}/documents/${documentId}`, documentData);
      return response.data;
    } catch (error) {
      console.error(`Error updating document ${documentId} for contract ${contractId}:`, error);
      throw error;
    }
  }

  // Delete contract document
  async deleteContractDocument(contractId, documentId) {
    try {
      const response = await axios.delete(`${API_URL}/contracts/${contractId}/documents/${documentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting document ${documentId} from contract ${contractId}:`, error);
      throw error;
    }
  }

  // Get contract milestones
  async getContractMilestones(contractId) {
    try {
      const response = await axios.get(`${API_URL}/contracts/${contractId}/milestones`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching milestones for contract ${contractId}:`, error);
      throw error;
    }
  }

  // Add contract milestone
  async addContractMilestone(contractId, milestoneData) {
    try {
      const response = await axios.post(`${API_URL}/contracts/${contractId}/milestones`, milestoneData);
      return response.data;
    } catch (error) {
      console.error(`Error adding milestone to contract ${contractId}:`, error);
      throw error;
    }
  }

  // Update contract milestone
  async updateContractMilestone(contractId, milestoneId, milestoneData) {
    try {
      const response = await axios.put(`${API_URL}/contracts/${contractId}/milestones/${milestoneId}`, milestoneData);
      return response.data;
    } catch (error) {
      console.error(`Error updating milestone ${milestoneId} for contract ${contractId}:`, error);
      throw error;
    }
  }

  // Delete contract milestone
  async deleteContractMilestone(contractId, milestoneId) {
    try {
      const response = await axios.delete(`${API_URL}/contracts/${contractId}/milestones/${milestoneId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting milestone ${milestoneId} from contract ${contractId}:`, error);
      throw error;
    }
  }

  // Get change orders
  async getChangeOrders(contractId) {
    try {
      const response = await axios.get(`${API_URL}/contracts/${contractId}/change-orders`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching change orders for contract ${contractId}:`, error);
      throw error;
    }
  }

  // Add change order
  async addChangeOrder(contractId, changeOrderData) {
    try {
      const response = await axios.post(`${API_URL}/contracts/${contractId}/change-orders`, changeOrderData);
      return response.data;
    } catch (error) {
      console.error(`Error adding change order to contract ${contractId}:`, error);
      throw error;
    }
  }

  // Update change order
  async updateChangeOrder(contractId, changeOrderId, changeOrderData) {
    try {
      const response = await axios.put(`${API_URL}/contracts/${contractId}/change-orders/${changeOrderId}`, changeOrderData);
      return response.data;
    } catch (error) {
      console.error(`Error updating change order ${changeOrderId} for contract ${contractId}:`, error);
      throw error;
    }
  }

  // Delete change order
  async deleteChangeOrder(contractId, changeOrderId) {
    try {
      const response = await axios.delete(`${API_URL}/contracts/${contractId}/change-orders/${changeOrderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting change order ${changeOrderId} from contract ${contractId}:`, error);
      throw error;
    }
  }

  // Get contract versions
  async getContractVersions(contractId) {
    try {
      const response = await axios.get(`${API_URL}/contracts/${contractId}/versions`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching versions for contract ${contractId}:`, error);
      throw error;
    }
  }

  // Create contract version
  async createContractVersion(contractId, versionData) {
    try {
      const response = await axios.post(`${API_URL}/contracts/${contractId}/versions`, versionData);
      return response.data;
    } catch (error) {
      console.error(`Error creating version for contract ${contractId}:`, error);
      throw error;
    }
  }

  // Delete contract version
  async deleteContractVersion(contractId, versionId) {
    try {
      const response = await axios.delete(`${API_URL}/contracts/${contractId}/versions/${versionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting version ${versionId} from contract ${contractId}:`, error);
      throw error;
    }
  }

  // Restore contract version
  async restoreContractVersion(contractId, versionId) {
    try {
      const response = await axios.post(`${API_URL}/contracts/${contractId}/versions/${versionId}/restore`);
      return response.data;
    } catch (error) {
      console.error(`Error restoring version ${versionId} for contract ${contractId}:`, error);
      throw error;
    }
  }

  // Compare contract versions
  async compareContractVersions(contractId, sourceVersionId, targetVersionId) {
    try {
      const response = await axios.get(`${API_URL}/contracts/${contractId}/versions/compare`, {
        params: {
          sourceVersionId,
          targetVersionId
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error comparing versions for contract ${contractId}:`, error);
      throw error;
    }
  }

  // Generate contract from template
  async generateContractFromTemplate(templateId, contractData) {
    try {
      const response = await axios.post(`${API_URL}/contracts/generate`, {
        templateId,
        ...contractData
      });
      return response.data;
    } catch (error) {
      console.error('Error generating contract from template:', error);
      throw error;
    }
  }

  // Generate contract section with AI
  async generateContractSection(section, contextData) {
    try {
      const response = await axios.post(`${API_URL}/contracts/ai/generate-section`, {
        section,
        contextData
      });
      return response.data;
    } catch (error) {
      console.error(`Error generating contract section with AI:`, error);
      throw error;
    }
  }

  // Export contract to PDF
  async exportContractToPdf(contractId) {
    try {
      const response = await axios.get(`${API_URL}/contracts/${contractId}/export/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Error exporting contract ${contractId} to PDF:`, error);
      throw error;
    }
  }

  // Export contract to Word
  async exportContractToWord(contractId) {
    try {
      const response = await axios.get(`${API_URL}/contracts/${contractId}/export/word`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Error exporting contract ${contractId} to Word:`, error);
      throw error;
    }
  }
}

export const contractService = new ContractService();
export default contractService;
