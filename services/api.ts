import axios from 'axios';

// API Configuration
const SPORTS_API_BASE = 'https://www.thesportsdb.com/api/v1/json';
const AUTH_API_BASE = 'https://dummyjson.com';

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
  // Get teams by league
  getTeamsByLeague: async (league: string) => {
    console.log('Using fallback teams for league:', league);
    
    // API endpoints are consistently returning 404, use reliable fallback data
    // This ensures the app always works with sample Premier League teams
    // Uncomment the API call below if/when the Sports API endpoints are fixed
    
    /* 
    try {
      const response = await sportsAxios.get('/1/lookup_all_teams.php?id=4328');
      if (response.data && response.data.teams) {
        console.log('API teams response:', response.data.teams.length, 'teams');
        return response.data;
      }
    } catch (error) {
      console.error('Error with teams API:', error);
    }
    */
    
    console.log('Using reliable fallback data');
    
    // Return sample data immediately (API endpoints returning 404)
    return {
      teams: [
          {
            idTeam: '133604',
            strTeam: 'Arsenal',
            strTeamBadge: 'https://logos-world.net/wp-content/uploads/2020/06/Arsenal-Logo.png',
            strLeague: 'English Premier League',
            strStadium: 'Emirates Stadium'
          },
          {
            idTeam: '133602',
            strTeam: 'Manchester United', 
            strTeamBadge: 'https://logos-world.net/wp-content/uploads/2020/06/Manchester-United-Logo.png',
            strLeague: 'English Premier League',
            strStadium: 'Old Trafford'
          },
          {
            idTeam: '133599',
            strTeam: 'Liverpool',
            strTeamBadge: 'https://logos-world.net/wp-content/uploads/2020/06/Liverpool-Logo.png',
            strLeague: 'English Premier League',
            strStadium: 'Anfield'
          },
          {
            idTeam: '133613',
            strTeam: 'Chelsea',
            strTeamBadge: 'https://logos-world.net/wp-content/uploads/2020/06/Chelsea-Logo.png',
            strLeague: 'English Premier League',
            strStadium: 'Stamford Bridge'
          }
        ]
      };
  },

  // Get players by team
  getPlayersByTeam: async (teamName: string) => {
    const response = await sportsAxios.get(`/1/searchplayers.php?t=${encodeURIComponent(teamName)}`);
    return response.data;
  },

  // Get matches by league
  getMatchesByLeague: async (league: string) => {
    console.log('Using fallback matches for league:', league);
    
    // API endpoints are consistently returning 404, use reliable fallback data
    // This ensures the app always works with sample match data
    // Uncomment the API call below if/when the Sports API endpoints are fixed
    
    /*
    try {
      const response = await sportsAxios.get('/1/eventsseason.php?id=4328&s=2023-2024');
      if (response.data && response.data.events && response.data.events.length > 0) {
        console.log('API matches response:', response.data.events.length, 'matches');
        return response.data;
      }
    } catch (error) {
      console.error('Error with matches API:', error);
    }
    */
    
    console.log('Using reliable fallback match data');
    
    // Return sample match data immediately (API endpoints returning 404)
    return {
      events: [
          {
            idEvent: '441617',
            strEvent: 'Arsenal vs Manchester United',
            strHomeTeam: 'Arsenal',
            strAwayTeam: 'Manchester United',
            intHomeScore: '3',
            intAwayScore: '1',
            dateEvent: '2024-01-20',
            strStatus: 'Match Finished'
          },
          {
            idEvent: '441618',
            strEvent: 'Liverpool vs Chelsea',
            strHomeTeam: 'Liverpool',
            strAwayTeam: 'Chelsea',
            intHomeScore: '2',
            intAwayScore: '1',
            dateEvent: '2024-01-21',
            strStatus: 'Match Finished'
          },
          {
            idEvent: '441619',
            strEvent: 'Manchester City vs Tottenham',
            strHomeTeam: 'Manchester City',
            strAwayTeam: 'Tottenham',
            intHomeScore: '4',
            intAwayScore: '0',
            dateEvent: '2024-01-22',
            strStatus: 'Match Finished'
          }
        ]
      };
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