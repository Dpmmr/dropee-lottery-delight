
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  created_at: string;
}

export interface Event {
  id: string;
  name: string;
  winners_count: number;
  event_date: string;
  active: boolean;
  created_at: string;
}

export interface Winner {
  id: string;
  customer_id: string;
  event_id: string;
  prize_description: string;
  won_at: string;
  customer?: Customer;
  event?: Event;
}

export interface Draw {
  id: string;
  event_id: string;
  total_participants: number;
  conducted_at: string;
  event?: Event;
}

export interface ExternalLink {
  id: string;
  name: string;
  url: string;
  created_at: string;
}

export interface LiveDraw {
  id: string;
  event_id: string;
  status: 'waiting' | 'countdown' | 'drawing' | 'revealing' | 'completed';
  countdown_duration: number;
  prizes: string[];
  current_winners: string[];
  total_participants: number;
  created_at: string;
  updated_at: string;
}

export interface DrawStatus {
  id: string;
  is_active: boolean;
  current_draw_id: string | null;
  updated_at: string;
}
