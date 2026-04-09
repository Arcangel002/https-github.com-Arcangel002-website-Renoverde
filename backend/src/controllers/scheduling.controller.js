/**
 * Scheduling Controller
 * Handles pickup scheduling requests
 */

import { sendEmail } from '../utils/email.js';

const scheduling = []; // In-memory storage (replace with database when ready)
let schedulingId = 1;

export const createScheduling = async (req, res) => {
  try {
    const { nome, email, telefone, tipo_residuo, data, horario, mensagem } = req.body;

    const newScheduling = {
      id: schedulingId++,
      nome,
      email,
      telefone,
      tipo_residuo,
      data_preferida: data,
      horario_preferido: horario,
      mensagem,
      status: 'pendente', // pendente, confirmado, concluido, cancelado
      created_at: new Date(),
      updated_at: new Date(),
    };

    scheduling.push(newScheduling);

    // Send email to admin
    try {
      if (process.env.ADMIN_EMAIL && process.env.EMAIL_USER) {
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: `Novo Agendamento: Recolha de ${tipo_residuo}`,
          template: 'scheduling-admin',
          data: {
            ...newScheduling,
            id: newScheduling.id,
          },
        });

        // Send confirmation to user
        await sendEmail({
          to: email,
          subject: 'Agendamento Recebido - Renoverde',
          template: 'scheduling-confirmation',
          data: {
            nome,
            data_preferida: data,
            horario_preferido: horario,
            tipo_residuo,
          },
        });
      }
    } catch (emailError) {
      console.error('Erro ao enviar emails:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Agendamento de recolha solicitado com sucesso!',
      data: newScheduling,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar agendamento',
      error: error.message,
    });
  }
};

export const getAllScheduling = async (req, res) => {
  try {
    res.json({
      success: true,
      data: scheduling,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar agendamentos',
      error: error.message,
    });
  }
};

export const getSchedulingById = async (req, res) => {
  try {
    const { id } = req.params;
    const schedulingRequest = scheduling.find(s => s.id === parseInt(id));

    if (!schedulingRequest) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado',
      });
    }

    res.json({
      success: true,
      data: schedulingRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar agendamento',
      error: error.message,
    });
  }
};

export const updateSchedulingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pendente', 'confirmado', 'concluido', 'cancelado'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido',
      });
    }

    const schedulingRequest = scheduling.find(s => s.id === parseInt(id));
    if (!schedulingRequest) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado',
      });
    }

    schedulingRequest.status = status;
    schedulingRequest.updated_at = new Date();

    res.json({
      success: true,
      message: 'Status atualizado com sucesso',
      data: schedulingRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar agendamento',
      error: error.message,
    });
  }
};

export const deleteScheduling = async (req, res) => {
  try {
    const { id } = req.params;
    const index = scheduling.findIndex(s => s.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado',
      });
    }

    const deleted = scheduling.splice(index, 1);

    res.json({
      success: true,
      message: 'Agendamento deletado com sucesso',
      data: deleted[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar agendamento',
      error: error.message,
    });
  }
};
