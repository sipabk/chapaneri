import { useMemo } from "react";
import { DbFamilyMember } from "@/hooks/useFamilyMembers";
import { FamilyRelationship } from "@/hooks/useRelationships";

export interface GenderStats {
  total: number;
  male: number;
  female: number;
  malePercent: number;
  femalePercent: number;
}

export interface LivingStats {
  living: number;
  deceased: number;
  livingPercent: number;
  deceasedPercent: number;
}

export interface RelationshipStatusStats {
  married: number;
  single: number;
  widowed: number;
  divorced: number;
  other: number;
}

export interface AgeGroup {
  range: string;
  male: number;
  female: number;
  total: number;
}

export interface PersonAge {
  id: string;
  name: string;
  age: number;
  birthYear: number;
  relationship: string;
}

export interface BirthMonthStat {
  month: string;
  count: number;
}

export interface ZodiacStat {
  sign: string;
  count: number;
}

export interface DecadeStat {
  decade: string;
  count: number;
}

export interface RelationshipNetworkStats {
  totalConnections: number;
  avgConnectionsPerPerson: number;
  mostConnected: { name: string; count: number }[];
  treeDepth: number;
  typeDistribution: { type: string; count: number }[];
}

export interface ChildrenStats {
  familySizeDistribution: { size: string; count: number }[];
  familyWithMostChildren: { parents: string; count: number } | null;
  peopleWithMostChildren: { name: string; count: number; gender: string }[];
  avgChildrenPerFamily: number;
  childlessMarried: number;
}

const getAge = (dob: string | null, dod: string | null): number | null => {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const end = dod ? new Date(dod) : new Date();
  if (isNaN(end.getTime())) return null;
  let age = end.getFullYear() - birth.getFullYear();
  const m = end.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) age--;
  return age >= 0 ? age : null;
};

const getZodiac = (dob: string): string | null => {
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;
  const month = d.getMonth() + 1;
  const day = d.getDate();
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  return "Capricorn";
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const useFamilyStatistics = (members: DbFamilyMember[], relationships: FamilyRelationship[]) => {
  const gender = useMemo<GenderStats>(() => {
    const total = members.length;
    const male = members.filter(m => m.gender === "male").length;
    const female = total - male;
    return {
      total, male, female,
      malePercent: total ? Math.round((male / total) * 100) : 0,
      femalePercent: total ? Math.round((female / total) * 100) : 0,
    };
  }, [members]);

  const living = useMemo<LivingStats>(() => {
    const deceased = members.filter(m => m.date_of_death).length;
    const alive = members.length - deceased;
    const total = members.length;
    return {
      living: alive, deceased,
      livingPercent: total ? Math.round((alive / total) * 100) : 0,
      deceasedPercent: total ? Math.round((deceased / total) * 100) : 0,
    };
  }, [members]);

  const relationshipStatus = useMemo<RelationshipStatusStats>(() => {
    const stats = { married: 0, single: 0, widowed: 0, divorced: 0, other: 0 };
    members.forEach(m => {
      const rel = (m.relationship || "").toLowerCase();
      if (rel.includes("married") || rel.includes("spouse") || rel.includes("wife") || rel.includes("husband")) stats.married++;
      else if (rel.includes("widow")) stats.widowed++;
      else if (rel.includes("divorce")) stats.divorced++;
      else if (rel.includes("single") || rel === "" || rel.includes("son") || rel.includes("daughter") || rel.includes("child")) stats.single++;
      else stats.other++;
    });
    return stats;
  }, [members]);

  const ageGroups = useMemo<AgeGroup[]>(() => {
    const ranges = ["0-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "80-89", "90+"];
    const groups = ranges.map(r => ({ range: r, male: 0, female: 0, total: 0 }));
    members.forEach(m => {
      const age = getAge(m.date_of_birth, m.date_of_death);
      if (age === null) return;
      let idx = Math.min(Math.floor(age / 10), 9);
      groups[idx].total++;
      if (m.gender === "male") groups[idx].male++;
      else groups[idx].female++;
    });
    return groups;
  }, [members]);

  const oldestLiving = useMemo<PersonAge[]>(() => {
    return members
      .filter(m => !m.date_of_death && m.date_of_birth)
      .map(m => ({ id: m.id, name: m.name, age: getAge(m.date_of_birth, null)!, birthYear: new Date(m.date_of_birth!).getFullYear(), relationship: m.relationship }))
      .filter(p => p.age !== null && !isNaN(p.birthYear))
      .sort((a, b) => b.age - a.age)
      .slice(0, 5);
  }, [members]);

  const youngestLiving = useMemo<PersonAge[]>(() => {
    return members
      .filter(m => !m.date_of_death && m.date_of_birth)
      .map(m => ({ id: m.id, name: m.name, age: getAge(m.date_of_birth, null)!, birthYear: new Date(m.date_of_birth!).getFullYear(), relationship: m.relationship }))
      .filter(p => p.age !== null && !isNaN(p.birthYear))
      .sort((a, b) => a.age - b.age)
      .slice(0, 5);
  }, [members]);

  const birthMonths = useMemo<BirthMonthStat[]>(() => {
    const counts = new Array(12).fill(0);
    members.forEach(m => {
      if (!m.date_of_birth) return;
      const d = new Date(m.date_of_birth);
      if (!isNaN(d.getTime())) counts[d.getMonth()]++;
    });
    return MONTHS.map((month, i) => ({ month, count: counts[i] }));
  }, [members]);

  const zodiacSigns = useMemo<ZodiacStat[]>(() => {
    const counts: Record<string, number> = {};
    members.forEach(m => {
      if (!m.date_of_birth) return;
      const sign = getZodiac(m.date_of_birth);
      if (sign) counts[sign] = (counts[sign] || 0) + 1;
    });
    return Object.entries(counts).map(([sign, count]) => ({ sign, count })).sort((a, b) => b.count - a.count);
  }, [members]);

  const birthDecades = useMemo<DecadeStat[]>(() => {
    const counts: Record<string, number> = {};
    members.forEach(m => {
      if (!m.date_of_birth) return;
      const y = new Date(m.date_of_birth).getFullYear();
      if (isNaN(y)) return;
      const decade = y < 1900 ? "1800s" : `${Math.floor(y / 10) * 10}s`;
      counts[decade] = (counts[decade] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0])).map(([decade, count]) => ({ decade, count }));
  }, [members]);

  const relationshipNetwork = useMemo<RelationshipNetworkStats>(() => {
    const totalConnections = relationships.length;
    const connectionCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};
    relationships.forEach(r => {
      connectionCounts[r.member_id] = (connectionCounts[r.member_id] || 0) + 1;
      typeCounts[r.relationship_type] = (typeCounts[r.relationship_type] || 0) + 1;
    });
    const memberMap = Object.fromEntries(members.map(m => [m.id, m.name]));
    const sorted = Object.entries(connectionCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const generations = new Set(members.map(m => m.generation));
    return {
      totalConnections,
      avgConnectionsPerPerson: members.length ? +(totalConnections / members.length).toFixed(1) : 0,
      mostConnected: sorted.map(([id, count]) => ({ name: memberMap[id] || "Unknown", count })),
      treeDepth: generations.size,
      typeDistribution: Object.entries(typeCounts).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count),
    };
  }, [members, relationships]);

  const childrenStats = useMemo<ChildrenStats>(() => {
    // Count children per parent using relationships
    const childrenOf: Record<string, string[]> = {};
    relationships.forEach(r => {
      if (r.relationship_type === "father" || r.relationship_type === "mother") {
        if (!childrenOf[r.member_id]) childrenOf[r.member_id] = [];
        childrenOf[r.member_id].push(r.related_member_id);
      }
    });

    const memberMap = Object.fromEntries(members.map(m => [m.id, m]));
    const sizes: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0, "5+": 0 };
    let maxChildren = 0;
    let maxParent = "";
    const parentList: { name: string; count: number; gender: string }[] = [];

    Object.entries(childrenOf).forEach(([parentId, kids]) => {
      const uniqueKids = [...new Set(kids)].length;
      if (uniqueKids === 0) return;
      const key = uniqueKids >= 5 ? "5+" : String(uniqueKids);
      sizes[key]++;
      const parent = memberMap[parentId];
      if (parent) {
        parentList.push({ name: parent.name, count: uniqueKids, gender: parent.gender });
        if (uniqueKids > maxChildren) {
          maxChildren = uniqueKids;
          maxParent = parent.name;
        }
      }
    });

    // Married but childless
    const marriedIds = new Set(
      relationships.filter(r => r.relationship_type === "spouse").map(r => r.member_id)
    );
    const parentsWithKids = new Set(Object.keys(childrenOf));
    const childlessMarried = [...marriedIds].filter(id => !parentsWithKids.has(id)).length;

    const totalParents = Object.keys(childrenOf).length;
    const totalKids = Object.values(childrenOf).reduce((s, k) => s + new Set(k).size, 0);

    return {
      familySizeDistribution: Object.entries(sizes).map(([size, count]) => ({ size: `${size} child${size === "1" ? "" : "ren"}`, count })),
      familyWithMostChildren: maxChildren > 0 ? { parents: maxParent, count: maxChildren } : null,
      peopleWithMostChildren: parentList.sort((a, b) => b.count - a.count).slice(0, 5),
      avgChildrenPerFamily: totalParents ? +(totalKids / totalParents).toFixed(1) : 0,
      childlessMarried,
    };
  }, [members, relationships]);

  const placesStats = useMemo(() => {
    const birthPlaces: Record<string, number> = {};
    const deathPlaces: Record<string, number> = {};
    const residences: Record<string, number> = {};
    members.forEach(m => {
      if (m.birth_place) birthPlaces[m.birth_place] = (birthPlaces[m.birth_place] || 0) + 1;
      if (m.death_place) deathPlaces[m.death_place] = (deathPlaces[m.death_place] || 0) + 1;
      if (m.address) residences[m.address] = (residences[m.address] || 0) + 1;
    });
    const toArr = (obj: Record<string, number>) => Object.entries(obj).map(([place, count]) => ({ place, count })).sort((a, b) => b.count - a.count);
    return { birthPlaces: toArr(birthPlaces), deathPlaces: toArr(deathPlaces), residences: toArr(residences) };
  }, [members]);

  return {
    gender, living, relationshipStatus, ageGroups, oldestLiving, youngestLiving,
    birthMonths, zodiacSigns, birthDecades, relationshipNetwork, childrenStats, placesStats,
  };
};
