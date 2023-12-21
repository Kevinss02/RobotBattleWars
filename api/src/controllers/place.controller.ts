import { Request, Response } from 'express';
import { Place } from '../entities/place.entity.js';
import { PlaceFilters, PlaceResponse } from '../utils/types/types.js';

export const getPlaces = async function (
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { place_id, name, location, capacity } = req.query;

    const filters: PlaceFilters = {};

    if (place_id !== undefined) {
      filters.place_id = parseInt(place_id as string);
    }

    if (capacity !== undefined) {
      filters.capacity = parseInt(capacity as string);
    }

    if (name !== undefined) {
      filters.name = name as string;
    }

    if (location !== undefined) {
      filters.location = location as string;
    }

    const places: PlaceResponse[] = await Place.find({
      where: filters,
    });

    if (places.length > 0) {
      res.status(200).json(places);
    } else {
      res.status(404).json({ error: 'Places not found' });
    }
  } catch (error) {
    console.error('Error while getting places:', error);

    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const registerPlace = async function (
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { name, location, capacity } = req.body;

    const place = new Place();
    place.name = name;
    place.location = location;
    place.capacity = capacity;

    await place.save();

    res.status(201).json(place);
  } catch (error) {
    console.error('Error while registering place:', error);

    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const deletePlace = async function (
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    if (id == null) {
      res.status(400).json({ error: 'Parameter "id" is required' });
      return;
    }

    const place = await Place.delete({ place_id: parseInt(id) });
  
    if (place.affected === 0) {
      res.status(404).json({ message: 'Place not found' });
      return;
    }

    res.status(204).json('Succesful detele');
  } catch (error) {
    console.error('Error while deleting place:', error);

    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}


