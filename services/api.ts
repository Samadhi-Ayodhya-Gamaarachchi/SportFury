import axios from 'axios';

// API Configuration
const SPORTS_API_BASE = 'https://www.thesportsdb.com/api/v1/json';
const AUTH_API_BASE = 'https://dummyjson.com';

// Sports and Leagues Configuration
export const SPORTS_CONFIG = {
  soccer: {
    name: 'Soccer',
    icon: 'target',
    emoji: '⚽',
    leagues: [
      { id: '4328', name: 'English Premier League', country: 'England' },
      { id: '4329', name: 'English League Championship', country: 'England' },
      { id: '4331', name: 'German Bundesliga', country: 'Germany' },
      { id: '4332', name: 'Italian Serie A', country: 'Italy' },
      { id: '4334', name: 'French Ligue 1', country: 'France' },
      { id: '4335', name: 'Spanish La Liga', country: 'Spain' }
    ]
  },
  basketball: {
    name: 'Basketball',
    icon: 'circle',
    emoji: '🏀',
    leagues: [
      { id: '4387', name: 'NBA', country: 'USA' },
      { id: '4388', name: 'NCAA', country: 'USA' }
    ]
  },
  baseball: {
    name: 'Baseball',
    icon: 'disc',
    emoji: '⚾',
    leagues: [
      { id: '4424', name: 'MLB', country: 'USA' }
    ]
  },
  hockey: {
    name: 'Ice Hockey',
    icon: 'navigation',
    emoji: '🏒',
    leagues: [
      { id: '4380', name: 'NHL', country: 'USA/Canada' }
    ]
  },
  americanfootball: {
    name: 'American Football',
    icon: 'shield',
    emoji: '🏈',
    leagues: [
      { id: '4391', name: 'NFL', country: 'USA' }
    ]
  },
  tennis: {
    name: 'Tennis',
    icon: 'circle',
    emoji: '🎾',
    leagues: [
      { id: '4500', name: 'ATP Tour', country: 'International' },
      { id: '4501', name: 'WTA Tour', country: 'International' }
    ]
  },
  motorsport: {
    name: 'Motorsport',
    icon: 'zap',
    emoji: '🏎️',
    leagues: [
      { id: '4370', name: 'Formula 1', country: 'International' }
    ]
  },
  golf: {
    name: 'Golf',
    icon: 'target',
    emoji: '⛳',
    leagues: [
      { id: '4502', name: 'PGA Tour', country: 'USA' }
    ]
  }
};

export type SportType = keyof typeof SPORTS_CONFIG;

// Create axios instances
export const sportsAxios = axios.create({
  baseURL: SPORTS_API_BASE,
  timeout: 10000,
});

export const authAxios = axios.create({
  baseURL: AUTH_API_BASE,
  timeout: 10000,
});



// Sports API
export const sportsAPI = {
  // Get teams by league and sport
  getTeamsByLeague: async (league: string, sport?: SportType) => {
    console.log('Fetching teams from TheSportsDB API for league:', league, 'sport:', sport);
    
    try {
      // Use the search endpoint that works
      const response = await sportsAxios.get(`/3/search_all_teams.php?l=${encodeURIComponent(league)}`);
      if (response.data && response.data.teams) {
        console.log('API teams response:', response.data.teams.length, 'teams');
        
        // Use only API data without hardcoded mappings
        const enhancedTeams = response.data.teams.map((team: any) => ({
          ...team,
          strDescription: team.strDescription || `${team.strTeam} is a professional football club.`
        }));
        
        return { teams: enhancedTeams };
      }
    } catch (error) {
      console.error('Error with teams API:', error);
      throw new Error(`Failed to fetch teams for league: ${league}`);
    }
    
    // Return empty if no data found
    return { teams: [] };
  },

  // Get teams by sport type
  getTeamsBySport: async (sport: SportType) => {
    console.log('Fetching teams for sport:', sport);
    
    const sportConfig = SPORTS_CONFIG[sport];
    if (!sportConfig || !sportConfig.leagues.length) {
      return { teams: [] };
    }

    try {
      // Get teams from the first league of the sport
      const primaryLeague = sportConfig.leagues[0];
      const response = await sportsAxios.get(`/3/search_all_teams.php?l=${encodeURIComponent(primaryLeague.name)}`);
      
      if (response.data && response.data.teams) {
        console.log(`API ${sport} teams response:`, response.data.teams.length, 'teams');
        
        // Use only API data without hardcoded mappings
        const enhancedTeams = response.data.teams.map((team: any) => ({
          ...team,
          strSport: sport,
          strDescription: team.strDescription || `${team.strTeam} is a professional ${sport} team.`
        }));
        
        return { teams: enhancedTeams };
      }
    } catch (error) {
      console.error(`Error fetching ${sport} teams:`, error);
      throw new Error(`Failed to fetch teams for sport: ${sport}`);
    }

    // Return empty if no data found
    return { teams: [] };
  },

  // Get players by team
  getPlayersByTeam: async (teamName: string) => {
    try {
      console.log('Fetching players for team:', teamName);
      const response = await sportsAxios.get(`/3/searchplayers.php?t=${encodeURIComponent(teamName)}`);
      if (response.data && response.data.player) {
        console.log('API players response:', response.data.player.length, 'players');
        
        // Use only API data without modifications
        const enhancedPlayers = response.data.player;
        
        return { player: enhancedPlayers };
      }
    } catch (error) {
      console.error('Error fetching players:', error);
      throw new Error(`Failed to fetch players for team: ${teamName}`);
    }
    
    // Return empty if no data found
    return { player: [] };
  },

  // Get matches by league
  getMatchesByLeague: async (league: string) => {
    console.log('Fetching matches from TheSportsDB API for league:', league);
    
    try {
      // Use current season events - get league ID first
      const currentYear = new Date().getFullYear();
      const season = `${currentYear-1}-${currentYear}`;
      
      // For Premier League (ID: 4328)
      const response = await sportsAxios.get(`/3/eventsseason.php?id=4328&s=${season}`);
      if (response.data && response.data.events && response.data.events.length > 0) {
        console.log('API matches response:', response.data.events.length, 'matches');
        // Return only the first 10 matches to avoid too much data
        return {
          events: response.data.events.slice(0, 10)
        };
      }
    } catch (error) {
      console.error('Error with matches API:', error);
      throw new Error(`Failed to fetch matches for league: ${league}`);
    }
    
    // Return empty if no data found
    return { events: [] };
  },

  // Search teams
  searchTeams: async (query: string) => {
    const response = await sportsAxios.get(`/1/searchteams.php?t=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get team details
  getTeamDetails: async (teamId: string) => {
    const response = await sportsAxios.get(`/1/lookupteam.php?id=${teamId}`);
    return response.data;
  },

  // Get player details
  getPlayerDetails: async (playerId: string) => {
    const response = await sportsAxios.get(`/1/lookupplayer.php?id=${playerId}`);
    return response.data;
  },

  // Get leagues
  getAllLeagues: async () => {
    const response = await sportsAxios.get('/1/all_leagues.php');
    return response.data;
  },

  // Get next 5 events for a team
  getNextEvents: async (teamId: string) => {
    const response = await sportsAxios.get(`/1/eventsnext.php?id=${teamId}`);
    return response.data;
  },

  // Get last 5 events for a team
  getLastEvents: async (teamId: string) => {
    const response = await sportsAxios.get(`/1/eventslast.php?id=${teamId}`);
    return response.data;
  },

  // Get all available sports
  getAllSports: () => {
    return Object.entries(SPORTS_CONFIG).map(([key, config]) => ({
      id: key,
      name: config.name,
      icon: config.icon,
      emoji: config.emoji,
      leagues: config.leagues
    }));
  },

  // Get leagues by sport
  getLeaguesBySport: (sport: SportType) => {
    return SPORTS_CONFIG[sport]?.leagues || [];
  },
};

// Authentication API (using DummyJSON)
export const authAPI = {
  // Login user
  login: async (credentials: { username: string; password: string }) => {
    try {
      console.log('Attempting login with:', credentials.username);
      const response = await authAxios.post('/auth/login', credentials);
      console.log('Login successful:', response.data);
      
      // DummyJSON returns accessToken, but we need token for consistency
      return {
        ...response.data,
        token: response.data.accessToken,
        id: response.data.id
      };
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Register user (simulate with DummyJSON user creation)
  register: async (userData: { 
    username: string; 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string;
  }) => {
    try {
      console.log('Attempting registration for:', userData.username);
      
      // Since DummyJSON doesn't have real registration, we'll simulate it
      // In a real app, this would be a proper registration endpoint
      const response = await authAxios.post('/users/add', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        image: 'https://dummyjson.com/icon/' + userData.username + '/128',
      });
      
      console.log('Registration successful:', response.data);
      
      // Add token for consistency with login response
      return {
        ...response.data,
        token: 'demo-token-' + Date.now(),
        accessToken: 'demo-token-' + Date.now(),
      };
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get user profile
  getProfile: async (userId: number) => {
    const response = await authAxios.get(`/users/${userId}`);
    return response.data;
  },

  // Get all users (for testing)
  getAllUsers: async () => {
    const response = await authAxios.get('/users');
    return response.data;
  },
};