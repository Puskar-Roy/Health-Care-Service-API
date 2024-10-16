import { Request, Response } from 'express';
import ServiceModel from '../models/serviceSchema';
import { IService } from '../interfaces/serviceInterface';
import redisClient from '../config/redis'; 


export const addService = async (req: Request, res: Response) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and Price are required' });
    }

    const newService: IService = new ServiceModel({
      name,
      description,
      price,
    });

    await newService.save();

    await redisClient.flushdb();

    return res.status(201).json(newService);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};


export const getAllServices = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const cacheKey = `services:page:${page}:limit:${limit}`;

    const cachedServices = await redisClient.get(cacheKey);

    if (cachedServices) {
      return res.status(200).json(JSON.parse(cachedServices));
    }

   
    const services = await ServiceModel.find().skip(skip).limit(limit);

    
    await redisClient.set(cacheKey, JSON.stringify(services), 'EX', 60 * 60); 

    return res.status(200).json(services);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};


export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    const updatedService = await ServiceModel.findByIdAndUpdate(
      id,
      { name, description, price },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

 
    await redisClient.flushdb(); 

    return res.status(200).json(updatedService);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};


export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedService = await ServiceModel.findByIdAndDelete(id);
    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

  
    await redisClient.flushdb();

    return res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
