
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

export interface FooterContent {
  id: string;
  description: string;
  updated_at: string;
}

export interface UserSession {
  id: string;
  session_id: string;
  last_seen: string;
}
