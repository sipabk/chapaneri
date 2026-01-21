// Family genealogy data extracted from the Chapaneri Family Report

export interface FamilyMember {
  id: number;
  name: string;
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  relationship: string;
  gender: 'male' | 'female';
  spouseId?: number;
  parentIds?: number[];
  childIds?: number[];
  generation: number;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export const familyMembers: FamilyMember[] = [
  // Main Subject
  {
    id: 12,
    name: "Jitendra Chapaneri",
    birthDate: "14 February 1972",
    birthPlace: "Mumbai",
    relationship: "Subject of Report",
    gender: "male",
    spouseId: 13,
    parentIds: [46, 47],
    childIds: [1, 2],
    generation: 3,
    email: "Sipa_bk@yahoo.com",
  },
  
  // Spouse
  {
    id: 13,
    name: "Amisha Jitendra Chapaneri",
    birthDate: "27 October 1977",
    birthPlace: "Surat",
    relationship: "Wife",
    gender: "female",
    spouseId: 12,
    parentIds: [81, 82],
    childIds: [1, 2],
    generation: 3,
    email: "Sipa_bk@hotmail.com",
  },
  
  // Children
  {
    id: 1,
    name: "Sanketh Chapaneri",
    birthDate: "22 March 2001",
    birthPlace: "Gaborone, Botswana",
    relationship: "Son",
    gender: "male",
    parentIds: [12, 13],
    generation: 4,
  },
  {
    id: 2,
    name: "Diya Chapaneri",
    birthDate: "23 August 2005",
    birthPlace: "Gaborone, Botswana",
    relationship: "Daughter",
    gender: "female",
    parentIds: [12, 13],
    generation: 4,
  },
  
  // Parents
  {
    id: 46,
    name: "Shantilal Champaneri",
    birthDate: "15 December 1933",
    birthPlace: "Vapi, Gujarat",
    relationship: "Father",
    gender: "male",
    spouseId: 47,
    parentIds: [74, 75],
    childIds: [14, 16, 18, 20, 22, 12],
    generation: 2,
    phone: "+91-251251-7734",
    address: "C2, Ground Floor, Sunder Nager, Surya Apartment, Virar, India",
  },
  {
    id: 47,
    name: "Kamlaben Shantilal Champaneri",
    birthDate: "18 October 1943",
    birthPlace: "Bidlaie, Gujarat",
    relationship: "Mother",
    gender: "female",
    spouseId: 46,
    parentIds: [76, 77],
    childIds: [14, 16, 18, 20, 22, 12],
    generation: 2,
  },
  
  // Siblings
  {
    id: 14,
    name: "Harsha Natwarlal Champaneri",
    birthDate: "13 September 1963",
    birthPlace: "Bombay",
    relationship: "Sister",
    gender: "female",
    spouseId: 15,
    parentIds: [46, 47],
    childIds: [3, 4],
    generation: 3,
  },
  {
    id: 16,
    name: "Jyoti Jagdish Naran",
    birthDate: "3 January 1965",
    birthPlace: "Bombay",
    relationship: "Sister",
    gender: "female",
    spouseId: 17,
    parentIds: [46, 47],
    childIds: [5, 6],
    generation: 3,
  },
  {
    id: 18,
    name: "Neeta Bipin Balsara",
    birthDate: "19 September 1966",
    birthPlace: "Bombay",
    relationship: "Sister",
    gender: "female",
    spouseId: 19,
    parentIds: [46, 47],
    childIds: [7, 8],
    generation: 3,
  },
  {
    id: 20,
    name: "Asha Ashwin Champaneri",
    birthDate: "15 August 1968",
    birthPlace: "Bombay",
    relationship: "Sister",
    gender: "female",
    spouseId: 21,
    parentIds: [46, 47],
    childIds: [9],
    generation: 3,
  },
  {
    id: 22,
    name: "Anjana Sachin Jote",
    birthDate: "29 June 1970",
    birthPlace: "Bombay",
    relationship: "Sister",
    gender: "female",
    spouseId: 23,
    parentIds: [46, 47],
    childIds: [10, 11],
    generation: 3,
  },
  
  // Brothers-in-law
  {
    id: 15,
    name: "Natwarlal Champaneri",
    birthDate: "11 May 1958",
    birthPlace: "Bombay",
    relationship: "Brother-in-law",
    gender: "male",
    spouseId: 14,
    childIds: [3, 4],
    generation: 3,
  },
  {
    id: 17,
    name: "Jagdish Naran",
    birthDate: "17 September 1956",
    birthPlace: "KweKwe, Zimbabwe",
    relationship: "Brother-in-law",
    gender: "male",
    spouseId: 16,
    childIds: [5, 6],
    generation: 3,
  },
  {
    id: 19,
    name: "Bipin Balsara",
    birthDate: "7 June 1962",
    birthPlace: "Bombay",
    relationship: "Brother-in-law",
    gender: "male",
    spouseId: 18,
    childIds: [7, 8],
    generation: 3,
  },
  {
    id: 21,
    name: "Ashvin Champaneri",
    birthDate: "25 December 1960",
    birthPlace: "Bombay",
    relationship: "Brother-in-law",
    gender: "male",
    spouseId: 20,
    childIds: [9],
    generation: 3,
  },
  {
    id: 23,
    name: "Sachin Jote",
    birthDate: "28 January 1979",
    relationship: "Brother-in-law",
    gender: "male",
    spouseId: 22,
    childIds: [10, 11],
    generation: 3,
  },
  
  // Nephews and Nieces
  {
    id: 3,
    name: "Biren Champaneri",
    birthDate: "25 March 1985",
    birthPlace: "Bombay",
    relationship: "Nephew",
    gender: "male",
    parentIds: [15, 14],
    generation: 4,
  },
  {
    id: 4,
    name: "Yash Champaneri",
    birthDate: "8 August 1992",
    birthPlace: "Bombay",
    relationship: "Nephew",
    gender: "male",
    parentIds: [15, 14],
    generation: 4,
  },
  {
    id: 5,
    name: "Hamel Naran",
    birthDate: "21 May 1988",
    birthPlace: "KweKwe, Zimbabwe",
    relationship: "Nephew",
    gender: "male",
    parentIds: [17, 16],
    generation: 4,
  },
  {
    id: 6,
    name: "Divesh Naran",
    birthDate: "18 May 1993",
    birthPlace: "KweKwe, Zimbabwe",
    relationship: "Nephew",
    gender: "male",
    parentIds: [17, 16],
    generation: 4,
  },
  {
    id: 7,
    name: "Monika Balsara",
    birthDate: "29 September 1989",
    birthPlace: "Bombay",
    relationship: "Niece",
    gender: "female",
    parentIds: [19, 18],
    generation: 4,
  },
  {
    id: 8,
    name: "Bhargave Balsara",
    birthDate: "14 November 1996",
    birthPlace: "Bombay",
    relationship: "Nephew",
    gender: "male",
    parentIds: [19, 18],
    generation: 4,
  },
  {
    id: 9,
    name: "Kumaresh Champaneri",
    birthDate: "18 January 1992",
    birthPlace: "Bombay",
    relationship: "Nephew",
    gender: "male",
    parentIds: [21, 20],
    generation: 4,
  },
  {
    id: 10,
    name: "Aishwarya Jote",
    birthDate: "14 March 1995",
    birthPlace: "Bombay",
    relationship: "Niece",
    gender: "female",
    parentIds: [23, 22],
    generation: 4,
  },
  {
    id: 11,
    name: "Samiksha Jote",
    birthDate: "10 October 1996",
    birthPlace: "Bombay",
    relationship: "Niece",
    gender: "female",
    parentIds: [23, 22],
    generation: 4,
  },
  
  // Grandparents (Paternal)
  {
    id: 74,
    name: "Bhagvanji Champaneri",
    birthPlace: "Vapi, Gujarat",
    relationship: "Paternal Grandfather",
    gender: "male",
    spouseId: 75,
    childIds: [46, 48, 50, 52, 54, 56, 58, 60, 61, 63],
    generation: 1,
  },
  {
    id: 75,
    name: "Hiraben Bhagvanji Champaneri",
    relationship: "Paternal Grandmother",
    gender: "female",
    spouseId: 74,
    parentIds: [78, 79],
    childIds: [46, 48, 50, 52, 54, 56, 58, 60, 61, 63],
    generation: 1,
  },
  
  // Grandparents (Maternal)
  {
    id: 76,
    name: "Narshibhai Champaneri",
    birthDate: "12 May 1912",
    birthPlace: "Bodlaie, Gujarat",
    deathDate: "12 July 1991",
    deathPlace: "Bodlaie, Gujarat",
    relationship: "Maternal Grandfather",
    gender: "male",
    spouseId: 77,
    parentIds: [80],
    childIds: [47, 65, 66, 67, 68, 69, 70, 71, 72, 73],
    generation: 1,
  },
  {
    id: 77,
    name: "Laxmiben Narshibhai Champaneri",
    birthDate: "28 September 1920",
    birthPlace: "Bodlaie, Gujarat",
    deathDate: "26 January 2001",
    deathPlace: "Bombay",
    relationship: "Maternal Grandmother",
    gender: "female",
    spouseId: 76,
    childIds: [47, 65, 66, 67, 68, 69, 70, 71, 72, 73],
    generation: 1,
  },
  
  // Great-Grandparents
  {
    id: 78,
    name: "Dayarambhai Champaneri",
    deathDate: "5 April 1981",
    relationship: "Great-Grandfather",
    gender: "male",
    spouseId: 79,
    childIds: [75],
    generation: 0,
  },
  {
    id: 79,
    name: "Dayieben Dayarambhai Champaneri",
    birthDate: "12 April 1971",
    relationship: "Great-Grandmother",
    gender: "female",
    spouseId: 78,
    childIds: [75],
    generation: 0,
  },
  {
    id: 80,
    name: "Parshotam Champaneri",
    relationship: "Great-Grandfather",
    gender: "male",
    childIds: [76],
    generation: 0,
  },
  
  // Wife's parents
  {
    id: 81,
    name: "Rasiklal Solanki",
    birthDate: "13 June 1954",
    birthPlace: "Surat, Gujarat",
    deathDate: "17 March 2001",
    deathPlace: "Surat",
    relationship: "Father-in-law",
    gender: "male",
    spouseId: 82,
    parentIds: [83, 84],
    childIds: [13],
    generation: 2,
  },
  {
    id: 82,
    name: "Mrs. Unknown",
    relationship: "Mother-in-law",
    gender: "female",
    spouseId: 81,
    parentIds: [85, 86],
    childIds: [13],
    generation: 2,
  },
  
  // Uncles and Aunts (Paternal side)
  {
    id: 48,
    name: "Ramesh Champaneri",
    relationship: "Uncle",
    gender: "male",
    parentIds: [74, 75],
    spouseId: 49,
    childIds: [24, 25],
    generation: 2,
  },
  {
    id: 49,
    name: "Sarda Champaneri",
    relationship: "Aunt",
    gender: "female",
    spouseId: 48,
    childIds: [24, 25],
    generation: 2,
  },
  {
    id: 50,
    name: "Narendra Champaneri",
    relationship: "Uncle",
    gender: "male",
    parentIds: [74, 75],
    spouseId: 51,
    childIds: [26, 27],
    generation: 2,
  },
  {
    id: 51,
    name: "Madhu Champaneri",
    relationship: "Aunt",
    gender: "female",
    spouseId: 50,
    childIds: [26, 27],
    generation: 2,
  },
  
  // Cousins from Ramesh Champaneri (48)
  {
    id: 24,
    name: "Sushma Champaneri",
    relationship: "Cousin",
    gender: "female",
    parentIds: [48, 49],
    generation: 3,
  },
  {
    id: 25,
    name: "Rajive Champaneri",
    relationship: "Cousin",
    gender: "male",
    parentIds: [48, 49],
    generation: 3,
  },
  
  // Cousins from Narendra Champaneri (50)
  {
    id: 26,
    name: "Binita Champaneri",
    relationship: "Cousin",
    gender: "female",
    parentIds: [50, 51],
    generation: 3,
  },
  {
    id: 27,
    name: "Tapan Champaneri",
    relationship: "Cousin",
    gender: "male",
    parentIds: [50, 51],
    generation: 3,
  },
  
  // Paternal Aunts and their families
  {
    id: 52,
    name: "Gajriben Chauhan",
    relationship: "Aunt",
    gender: "female",
    parentIds: [74, 75],
    spouseId: 53,
    childIds: [28, 29, 30, 31],
    generation: 2,
  },
  {
    id: 53,
    name: "Ishwarlal Chauhan",
    relationship: "Uncle by Marriage",
    gender: "male",
    spouseId: 52,
    childIds: [28, 29, 30, 31],
    generation: 2,
  },
  {
    id: 54,
    name: "Sushilaben Chauhan",
    relationship: "Aunt",
    gender: "female",
    parentIds: [74, 75],
    spouseId: 55,
    childIds: [32, 33, 34, 35],
    generation: 2,
  },
  {
    id: 55,
    name: "Maganlal Chauhan",
    relationship: "Uncle by Marriage",
    gender: "male",
    spouseId: 54,
    childIds: [32, 33, 34, 35],
    generation: 2,
  },
  {
    id: 56,
    name: "Savitaben Parmar",
    relationship: "Aunt",
    gender: "female",
    parentIds: [74, 75],
    spouseId: 57,
    childIds: [36, 37, 38],
    generation: 2,
  },
  {
    id: 57,
    name: "Muljiebhai Parmar",
    relationship: "Uncle by Marriage",
    gender: "male",
    spouseId: 56,
    childIds: [36, 37, 38],
    generation: 2,
  },
  {
    id: 58,
    name: "Madhuben Varma",
    relationship: "Aunt",
    gender: "female",
    parentIds: [74, 75],
    spouseId: 59,
    childIds: [39, 40, 41],
    generation: 2,
  },
  {
    id: 59,
    name: "Arvind Varma",
    relationship: "Uncle by Marriage",
    gender: "male",
    spouseId: 58,
    childIds: [39, 40, 41],
    generation: 2,
  },
  {
    id: 60,
    name: "Indiera Champaneri",
    relationship: "Aunt",
    gender: "female",
    parentIds: [74, 75],
    generation: 2,
  },
  {
    id: 61,
    name: "Natwarlal Champaneri",
    relationship: "Uncle",
    gender: "male",
    parentIds: [74, 75],
    spouseId: 62,
    childIds: [42],
    generation: 2,
  },
  {
    id: 62,
    name: "Jashu Natwarlal Champaneri",
    relationship: "Aunt by Marriage",
    gender: "female",
    spouseId: 61,
    childIds: [42],
    generation: 2,
  },
  {
    id: 63,
    name: "Kishor Champaneri",
    relationship: "Uncle",
    gender: "male",
    parentIds: [74, 75],
    spouseId: 64,
    childIds: [43, 44, 45],
    generation: 2,
  },
  {
    id: 64,
    name: "Usha (Jyoti) Kishor Champaneri",
    relationship: "Aunt by Marriage",
    gender: "female",
    spouseId: 63,
    childIds: [43, 44, 45],
    generation: 2,
  },
  
  // Cousins from Gajriben Chauhan (52)
  {
    id: 28,
    name: "Geetaben Champaneri",
    relationship: "Cousin",
    gender: "female",
    parentIds: [53, 52],
    generation: 3,
  },
  {
    id: 29,
    name: "Shashikant Chauhan",
    relationship: "Cousin",
    gender: "male",
    parentIds: [53, 52],
    generation: 3,
  },
  {
    id: 30,
    name: "Niranjan Chauhan",
    relationship: "Cousin",
    gender: "male",
    parentIds: [53, 52],
    generation: 3,
  },
  {
    id: 31,
    name: "Rajesh Chauhan",
    relationship: "Cousin",
    gender: "male",
    parentIds: [53, 52],
    generation: 3,
  },
  
  // Cousins from Sushilaben Chauhan (54)
  {
    id: 32,
    name: "Bhupendra Chauhan",
    relationship: "Cousin",
    gender: "male",
    parentIds: [55, 54],
    generation: 3,
  },
  {
    id: 33,
    name: "Bhikhu Chauhan",
    relationship: "Cousin",
    gender: "male",
    parentIds: [55, 54],
    generation: 3,
  },
  {
    id: 34,
    name: "Jyoti Chauhan",
    relationship: "Cousin",
    gender: "female",
    parentIds: [55, 54],
    generation: 3,
  },
  {
    id: 35,
    name: "Poonam Chauhan",
    relationship: "Cousin",
    gender: "female",
    parentIds: [55, 54],
    generation: 3,
  },
  
  // Cousins from Savitaben Parmar (56)
  {
    id: 36,
    name: "Naresh Parmar",
    relationship: "Cousin",
    gender: "male",
    parentIds: [57, 56],
    generation: 3,
  },
  {
    id: 37,
    name: "Raju Parmar",
    relationship: "Cousin",
    gender: "male",
    parentIds: [57, 56],
    generation: 3,
  },
  {
    id: 38,
    name: "Kalpana Parmar",
    relationship: "Cousin",
    gender: "female",
    parentIds: [57, 56],
    generation: 3,
  },
  
  // Cousins from Madhuben Varma (58)
  {
    id: 39,
    name: "Manoj Varma",
    relationship: "Cousin",
    gender: "male",
    parentIds: [59, 58],
    generation: 3,
  },
  {
    id: 40,
    name: "Mukesh Varma",
    relationship: "Cousin",
    gender: "male",
    parentIds: [59, 58],
    generation: 3,
  },
  {
    id: 41,
    name: "Yogita Parmar",
    relationship: "Cousin",
    gender: "female",
    parentIds: [59, 58],
    generation: 3,
  },
  
  // Cousin from Natwarlal Champaneri (61)
  {
    id: 42,
    name: "Divesh Champaneri",
    relationship: "Cousin",
    gender: "male",
    parentIds: [61, 62],
    generation: 3,
  },
  
  // Cousins from Kishor Champaneri (63)
  {
    id: 43,
    name: "Shilpa Parmar",
    relationship: "Cousin",
    gender: "female",
    parentIds: [63, 64],
    generation: 3,
  },
  {
    id: 44,
    name: "Urvashi Champaneri",
    relationship: "Cousin",
    gender: "female",
    parentIds: [63, 64],
    generation: 3,
  },
  {
    id: 45,
    name: "Umesh Champaneri",
    relationship: "Cousin",
    gender: "male",
    parentIds: [63, 64],
    generation: 3,
  },
  
  // Maternal Uncles and Aunts
  {
    id: 65,
    name: "Chaganbhai Champaneri",
    relationship: "Uncle",
    gender: "male",
    parentIds: [76, 77],
    generation: 2,
  },
  {
    id: 66,
    name: "Dinesh Champaneri",
    relationship: "Uncle",
    gender: "male",
    parentIds: [76, 77],
    generation: 2,
  },
  {
    id: 67,
    name: "Harendra Champaneri",
    relationship: "Uncle",
    gender: "male",
    parentIds: [76, 77],
    generation: 2,
  },
  {
    id: 68,
    name: "Shashi Champaneri",
    relationship: "Uncle",
    gender: "male",
    parentIds: [76, 77],
    generation: 2,
  },
  {
    id: 69,
    name: "Pravin Champaneri",
    relationship: "Uncle",
    gender: "male",
    parentIds: [76, 77],
    generation: 2,
  },
  {
    id: 70,
    name: "Arvind Champaneri",
    relationship: "Uncle",
    gender: "male",
    parentIds: [76, 77],
    generation: 2,
  },
  {
    id: 71,
    name: "Damyanti Chotalal Chawda",
    relationship: "Aunt",
    gender: "female",
    parentIds: [76, 77],
    generation: 2,
  },
  {
    id: 72,
    name: "Nirmalaben Thakorlal Chawda",
    relationship: "Aunt",
    gender: "female",
    parentIds: [76, 77],
    generation: 2,
  },
  {
    id: 73,
    name: "Hansa Bhagubhai Solanki",
    relationship: "Aunt",
    gender: "female",
    parentIds: [76, 77],
    generation: 2,
  },
  
  // Wife's extended family
  {
    id: 83,
    name: "Dayabhai Solanki",
    birthDate: "1 May 1932",
    birthPlace: "Rajpardi, Gujarat",
    relationship: "Wife's Grandfather",
    gender: "male",
    spouseId: 84,
    childIds: [81],
    generation: 1,
  },
  {
    id: 84,
    name: "Narmadaben Dayabhai Solanki",
    birthDate: "21 April 1935",
    birthPlace: "Randed, Gujarat",
    deathDate: "23 September 2003",
    deathPlace: "Surat, Gujarat",
    relationship: "Wife's Grandmother",
    gender: "female",
    spouseId: 83,
    childIds: [81],
    generation: 1,
  },
  {
    id: 85,
    name: "Parsottambhai Parmar",
    relationship: "Wife's Grandfather",
    gender: "male",
    spouseId: 86,
    childIds: [82],
    generation: 1,
  },
  {
    id: 86,
    name: "Bhikiben Parsottambhai Parmar",
    relationship: "Wife's Grandmother",
    gender: "female",
    spouseId: 85,
    childIds: [82],
    generation: 1,
  },
];

// Utility functions
export const getMemberById = (id: number): FamilyMember | undefined => {
  return familyMembers.find(member => member.id === id);
};

export const getChildren = (memberId: number): FamilyMember[] => {
  return familyMembers.filter(member => 
    member.parentIds?.includes(memberId)
  );
};

export const getParents = (memberId: number): FamilyMember[] => {
  const member = getMemberById(memberId);
  if (!member?.parentIds) return [];
  return member.parentIds.map(id => getMemberById(id)).filter(Boolean) as FamilyMember[];
};

export const getSiblings = (memberId: number): FamilyMember[] => {
  const member = getMemberById(memberId);
  if (!member?.parentIds?.length) return [];
  
  return familyMembers.filter(m => 
    m.id !== memberId && 
    m.parentIds?.some(pid => member.parentIds?.includes(pid))
  );
};

export const getSpouse = (memberId: number): FamilyMember | undefined => {
  const member = getMemberById(memberId);
  if (!member?.spouseId) return undefined;
  return getMemberById(member.spouseId);
};

export const getMembersByGeneration = (generation: number): FamilyMember[] => {
  return familyMembers.filter(member => member.generation === generation);
};

export const getMembersByRelationship = (relationship: string): FamilyMember[] => {
  return familyMembers.filter(member => 
    member.relationship.toLowerCase().includes(relationship.toLowerCase())
  );
};

export const searchMembers = (query: string): FamilyMember[] => {
  const lowerQuery = query.toLowerCase();
  return familyMembers.filter(member =>
    member.name.toLowerCase().includes(lowerQuery) ||
    member.birthPlace?.toLowerCase().includes(lowerQuery) ||
    member.relationship.toLowerCase().includes(lowerQuery)
  );
};

// Timeline events
export interface TimelineEvent {
  date: string;
  sortDate: number;
  type: 'birth' | 'death' | 'marriage';
  title: string;
  description: string;
  memberId: number;
}

export const getTimelineEvents = (): TimelineEvent[] => {
  const events: TimelineEvent[] = [];
  
  familyMembers.forEach(member => {
    if (member.birthDate) {
      const year = parseInt(member.birthDate.split(' ').pop() || '0');
      events.push({
        date: member.birthDate,
        sortDate: year,
        type: 'birth',
        title: `${member.name} was born`,
        description: member.birthPlace ? `Born in ${member.birthPlace}` : 'Birth recorded',
        memberId: member.id,
      });
    }
    
    if (member.deathDate) {
      const year = parseInt(member.deathDate.split(' ').pop() || '0');
      events.push({
        date: member.deathDate,
        sortDate: year,
        type: 'death',
        title: `${member.name} passed away`,
        description: member.deathPlace ? `In ${member.deathPlace}` : 'Death recorded',
        memberId: member.id,
      });
    }
  });
  
  return events.sort((a, b) => a.sortDate - b.sortDate);
};

// Statistics
export const getFamilyStats = () => {
  const totalMembers = familyMembers.length;
  const generations = new Set(familyMembers.map(m => m.generation)).size;
  const places = new Set(
    familyMembers
      .map(m => m.birthPlace)
      .filter(Boolean)
  ).size;
  const marriages = familyMembers.filter(m => m.spouseId).length / 2;
  
  return {
    totalMembers,
    generations,
    places,
    marriages,
  };
};
