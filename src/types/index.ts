export type CampaignStatus = 'agendado' | 'emRota' | 'concluido';
export type TeamMemberStatus = 'Em Atividade' | 'Disponível' | 'Indisponível';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  avatar?: string;
}

export interface AllocatedTeamMember {
  id: string | number;
  name: string;
  phone: string;
  avatar: string;
}

export interface Campaign {
  id: string;
  title: string;
  client: string; // Nome ou referência
  services: string[];
  estimated_promoters?: number;
  logistics?: any;
  amount: string; // Na prática seria number, deixamos string para formatar K/M fácil no frontend visual
  serviceColor: string;
  status: CampaignStatus;
  revenue: number;
  allocatedTeam: AllocatedTeamMember[];
}

export interface TeamMember {
  id: number | string;
  name: string;
  phone: string;
  rating: number;
  reviews: number;
  status: TeamMemberStatus;
  avatar: string;
}

export interface ClientB2B {
  id: string;
  name: string;
  niche: string;
  status: 'Mensal' | 'Avulso' | 'Lead';
  ltv: number;
  activeCampaigns: number;
  avatar: string;
}

export type PayoutStatus = 'Pendente' | 'Pago';

export interface Payout {
  id: string;
  workerName: string;
  campaignTitle: string;
  amount: number;
  pixKey: string;
  status: PayoutStatus;
}

export interface CustomMarker {
  id: string;
  lat: number;
  lng: number;
  name: string;
  priceModifier: number;
}

export interface NeighborhoodArea {
  id: string;
  name: string;
  basePrice: number;
  isActive: boolean;
  required_flyers_thousands?: number;
  required_promoters?: number;
  points: [number, number][]; // Array of [lat, lng]
}
