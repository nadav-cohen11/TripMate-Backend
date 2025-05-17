import axios from 'axios';

export async function searchHotelsByCoordinates(lat, lan) {
  const today = new Date();
  const checkin_date = today.toISOString().split('T')[0];
  const checkout = new Date(today);
  checkout.setDate(today.getDate() + 3);
  const checkout_date = checkout.toISOString().split('T')[0];

  const options = {
    method: 'GET',
    url: 'https://booking-com.p.rapidapi.com/v1/hotels/search-by-coordinates',
    params: {
      room_number: '1',
      children_number: '1',
      filter_by_currency: 'USD',
      page_number: '0',
      units: 'metric',
      checkin_date,
      checkout_date,
      locale: 'en-gb',
      categories_filter_ids: 'class::2,class::4,free_cancellation::1',
      order_by: 'popularity',
      latitude: lat,
      longitude: lan,
      adults_number: '2',
    },
    headers: {
      'x-rapidapi-key': 'f3f61ff162mshe7aefb390473283p16c9b1jsna80643caf5d1',
      'x-rapidapi-host': 'booking-com.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;

  } catch (error) {
    console.error(error);
    throw error;
  }
}



