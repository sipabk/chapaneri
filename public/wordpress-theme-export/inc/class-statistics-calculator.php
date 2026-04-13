<?php
/**
 * Statistics Calculator
 *
 * Server-side statistics engine mirroring the React useFamilyStatistics hook.
 *
 * @package Chapaneri_Heritage
 * @since 3.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

class Chapaneri_Statistics_Calculator {

    private static $instance = null;
    private $members = null;
    private $relationships = null;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }

    /**
     * Load all family members
     */
    private function load_members() {
        if ($this->members !== null) return;

        $posts = get_posts(array(
            'post_type'      => 'family_member',
            'posts_per_page' => -1,
            'post_status'    => 'publish',
        ));

        $this->members = array();
        foreach ($posts as $post) {
            $this->members[] = array(
                'id'            => $post->ID,
                'name'          => $post->post_title,
                'gender'        => get_post_meta($post->ID, '_gender', true) ?: 'male',
                'date_of_birth' => get_post_meta($post->ID, '_birth_date', true),
                'date_of_death' => get_post_meta($post->ID, '_death_date', true),
                'birth_place'   => get_post_meta($post->ID, '_birth_place', true),
                'death_place'   => get_post_meta($post->ID, '_death_place', true),
                'address'       => get_post_meta($post->ID, '_address', true),
                'relationship'  => '',
                'generation'    => 0,
                'spouse_id'     => get_post_meta($post->ID, '_spouse_id', true),
            );

            // Get generation from taxonomy
            $gens = wp_get_object_terms($post->ID, 'generation');
            if (!empty($gens)) {
                $idx = count($this->members) - 1;
                $this->members[$idx]['generation'] = intval($gens[0]->name);
            }

            // Get relationship from taxonomy
            $rels = wp_get_object_terms($post->ID, 'relationship');
            if (!empty($rels)) {
                $idx = count($this->members) - 1;
                $this->members[$idx]['relationship'] = $rels[0]->name;
            }
        }
    }

    /**
     * Load all relationships from custom table
     */
    private function load_relationships() {
        if ($this->relationships !== null) return;

        global $wpdb;
        $table = $wpdb->prefix . 'family_relationships';

        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '$table'") === $table;
        if (!$table_exists) {
            $this->relationships = array();
            return;
        }

        $this->relationships = $wpdb->get_results("SELECT * FROM $table", ARRAY_A);
    }

    /**
     * Calculate age from DOB
     */
    private function get_age($dob, $dod = null) {
        if (empty($dob)) return null;
        $birth = strtotime($dob);
        if (!$birth) return null;

        $end = $dod ? strtotime($dod) : time();
        if (!$end) return null;

        $age = (int) date('Y', $end) - (int) date('Y', $birth);
        if (date('md', $end) < date('md', $birth)) $age--;

        return $age >= 0 ? $age : null;
    }

    /**
     * Get zodiac sign from date
     */
    private function get_zodiac($dob) {
        $d = strtotime($dob);
        if (!$d) return null;

        $month = (int) date('n', $d);
        $day = (int) date('j', $d);

        if (($month == 1 && $day >= 20) || ($month == 2 && $day <= 18)) return 'Aquarius';
        if (($month == 2 && $day >= 19) || ($month == 3 && $day <= 20)) return 'Pisces';
        if (($month == 3 && $day >= 21) || ($month == 4 && $day <= 19)) return 'Aries';
        if (($month == 4 && $day >= 20) || ($month == 5 && $day <= 20)) return 'Taurus';
        if (($month == 5 && $day >= 21) || ($month == 6 && $day <= 20)) return 'Gemini';
        if (($month == 6 && $day >= 21) || ($month == 7 && $day <= 22)) return 'Cancer';
        if (($month == 7 && $day >= 23) || ($month == 8 && $day <= 22)) return 'Leo';
        if (($month == 8 && $day >= 23) || ($month == 9 && $day <= 22)) return 'Virgo';
        if (($month == 9 && $day >= 23) || ($month == 10 && $day <= 22)) return 'Libra';
        if (($month == 10 && $day >= 23) || ($month == 11 && $day <= 21)) return 'Scorpio';
        if (($month == 11 && $day >= 22) || ($month == 12 && $day <= 21)) return 'Sagittarius';
        return 'Capricorn';
    }

    // =========================================================================
    // PUBLIC STAT METHODS
    // =========================================================================

    public function get_gender_stats() {
        $this->load_members();
        $total = count($this->members);
        $male = count(array_filter($this->members, function($m) { return $m['gender'] === 'male'; }));
        $female = $total - $male;
        return array(
            'total' => $total, 'male' => $male, 'female' => $female,
            'malePercent' => $total ? round(($male / $total) * 100) : 0,
            'femalePercent' => $total ? round(($female / $total) * 100) : 0,
        );
    }

    public function get_living_stats() {
        $this->load_members();
        $total = count($this->members);
        $deceased = count(array_filter($this->members, function($m) { return !empty($m['date_of_death']); }));
        $living = $total - $deceased;
        return array(
            'living' => $living, 'deceased' => $deceased,
            'livingPercent' => $total ? round(($living / $total) * 100) : 0,
            'deceasedPercent' => $total ? round(($deceased / $total) * 100) : 0,
        );
    }

    public function get_age_groups() {
        $this->load_members();
        $ranges = array('0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90+');
        $groups = array();
        foreach ($ranges as $r) {
            $groups[$r] = array('range' => $r, 'male' => 0, 'female' => 0, 'total' => 0);
        }

        foreach ($this->members as $m) {
            $age = $this->get_age($m['date_of_birth'], $m['date_of_death']);
            if ($age === null) continue;
            $idx = min(intval($age / 10), 9);
            $key = $ranges[$idx];
            $groups[$key]['total']++;
            if ($m['gender'] === 'male') $groups[$key]['male']++;
            else $groups[$key]['female']++;
        }

        return array_values($groups);
    }

    public function get_oldest_living($limit = 5) {
        $this->load_members();
        $people = array();
        foreach ($this->members as $m) {
            if (!empty($m['date_of_death']) || empty($m['date_of_birth'])) continue;
            $age = $this->get_age($m['date_of_birth']);
            if ($age === null) continue;
            $people[] = array('id' => $m['id'], 'name' => $m['name'], 'age' => $age, 'birthYear' => (int) date('Y', strtotime($m['date_of_birth'])));
        }
        usort($people, function($a, $b) { return $b['age'] - $a['age']; });
        return array_slice($people, 0, $limit);
    }

    public function get_youngest_living($limit = 5) {
        $this->load_members();
        $people = array();
        foreach ($this->members as $m) {
            if (!empty($m['date_of_death']) || empty($m['date_of_birth'])) continue;
            $age = $this->get_age($m['date_of_birth']);
            if ($age === null) continue;
            $people[] = array('id' => $m['id'], 'name' => $m['name'], 'age' => $age, 'birthYear' => (int) date('Y', strtotime($m['date_of_birth'])));
        }
        usort($people, function($a, $b) { return $a['age'] - $b['age']; });
        return array_slice($people, 0, $limit);
    }

    public function get_birth_months() {
        $this->load_members();
        $months = array('January','February','March','April','May','June','July','August','September','October','November','December');
        $counts = array_fill(0, 12, 0);

        foreach ($this->members as $m) {
            if (empty($m['date_of_birth'])) continue;
            $t = strtotime($m['date_of_birth']);
            if ($t) $counts[(int) date('n', $t) - 1]++;
        }

        $result = array();
        foreach ($months as $i => $name) {
            $result[] = array('month' => $name, 'count' => $counts[$i]);
        }
        return $result;
    }

    public function get_zodiac_signs() {
        $this->load_members();
        $counts = array();
        foreach ($this->members as $m) {
            if (empty($m['date_of_birth'])) continue;
            $sign = $this->get_zodiac($m['date_of_birth']);
            if ($sign) {
                $counts[$sign] = ($counts[$sign] ?? 0) + 1;
            }
        }
        arsort($counts);
        $result = array();
        foreach ($counts as $sign => $count) {
            $result[] = array('sign' => $sign, 'count' => $count);
        }
        return $result;
    }

    public function get_birth_decades() {
        $this->load_members();
        $counts = array();
        foreach ($this->members as $m) {
            if (empty($m['date_of_birth'])) continue;
            $y = (int) date('Y', strtotime($m['date_of_birth']));
            if (!$y) continue;
            $decade = $y < 1900 ? '1800s' : (intval($y / 10) * 10) . 's';
            $counts[$decade] = ($counts[$decade] ?? 0) + 1;
        }
        ksort($counts);
        $result = array();
        foreach ($counts as $decade => $count) {
            $result[] = array('decade' => $decade, 'count' => $count);
        }
        return $result;
    }

    public function get_relationship_network() {
        $this->load_members();
        $this->load_relationships();

        $total = count($this->relationships);
        $conn = array();
        $types = array();

        foreach ($this->relationships as $r) {
            $conn[$r['member_id']] = ($conn[$r['member_id']] ?? 0) + 1;
            $types[$r['relationship_type']] = ($types[$r['relationship_type']] ?? 0) + 1;
        }

        $member_map = array();
        foreach ($this->members as $m) {
            $member_map[$m['id']] = $m['name'];
        }

        arsort($conn);
        $most_connected = array();
        $i = 0;
        foreach ($conn as $id => $count) {
            if ($i >= 5) break;
            $most_connected[] = array('name' => $member_map[$id] ?? 'Unknown', 'count' => $count);
            $i++;
        }

        $generations = array_unique(array_column($this->members, 'generation'));

        $type_dist = array();
        arsort($types);
        foreach ($types as $t => $c) {
            $type_dist[] = array('type' => $t, 'count' => $c);
        }

        $member_count = count($this->members);

        return array(
            'totalConnections'        => $total,
            'avgConnectionsPerPerson' => $member_count ? round($total / $member_count, 1) : 0,
            'mostConnected'           => $most_connected,
            'treeDepth'               => count($generations),
            'typeDistribution'        => $type_dist,
        );
    }

    public function get_children_stats() {
        $this->load_members();
        $this->load_relationships();

        $children_of = array();
        foreach ($this->relationships as $r) {
            if (in_array($r['relationship_type'], array('father', 'mother'))) {
                $children_of[$r['member_id']][] = $r['related_member_id'];
            }
        }

        $member_map = array();
        foreach ($this->members as $m) {
            $member_map[$m['id']] = $m;
        }

        $sizes = array('1' => 0, '2' => 0, '3' => 0, '4' => 0, '5+' => 0);
        $max_children = 0;
        $max_parent = '';
        $parent_list = array();

        foreach ($children_of as $parent_id => $kids) {
            $unique = count(array_unique($kids));
            if ($unique === 0) continue;
            $key = $unique >= 5 ? '5+' : (string) $unique;
            $sizes[$key]++;
            $parent = $member_map[$parent_id] ?? null;
            if ($parent) {
                $parent_list[] = array('name' => $parent['name'], 'count' => $unique, 'gender' => $parent['gender']);
                if ($unique > $max_children) {
                    $max_children = $unique;
                    $max_parent = $parent['name'];
                }
            }
        }

        // Married but childless
        $married_ids = array();
        foreach ($this->relationships as $r) {
            if ($r['relationship_type'] === 'spouse') {
                $married_ids[$r['member_id']] = true;
            }
        }
        $parents_with_kids = array_keys($children_of);
        $childless = 0;
        foreach (array_keys($married_ids) as $id) {
            if (!in_array($id, $parents_with_kids)) $childless++;
        }

        $total_parents = count($children_of);
        $total_kids = 0;
        foreach ($children_of as $kids) {
            $total_kids += count(array_unique($kids));
        }

        usort($parent_list, function($a, $b) { return $b['count'] - $a['count']; });

        $size_dist = array();
        foreach ($sizes as $s => $c) {
            $label = $s === '1' ? '1 child' : $s . ' children';
            $size_dist[] = array('size' => $label, 'count' => $c);
        }

        return array(
            'familySizeDistribution'  => $size_dist,
            'familyWithMostChildren'  => $max_children > 0 ? array('parents' => $max_parent, 'count' => $max_children) : null,
            'peopleWithMostChildren'  => array_slice($parent_list, 0, 5),
            'avgChildrenPerFamily'    => $total_parents ? round($total_kids / $total_parents, 1) : 0,
            'childlessMarried'        => $childless,
        );
    }

    public function get_places_stats() {
        $this->load_members();

        $birth_places = array();
        $death_places = array();
        $residences = array();

        foreach ($this->members as $m) {
            if (!empty($m['birth_place'])) $birth_places[$m['birth_place']] = ($birth_places[$m['birth_place']] ?? 0) + 1;
            if (!empty($m['death_place'])) $death_places[$m['death_place']] = ($death_places[$m['death_place']] ?? 0) + 1;
            if (!empty($m['address'])) $residences[$m['address']] = ($residences[$m['address']] ?? 0) + 1;
        }

        $to_arr = function($arr) {
            arsort($arr);
            $result = array();
            foreach ($arr as $place => $count) {
                $result[] = array('place' => $place, 'count' => $count);
            }
            return $result;
        };

        return array(
            'birthPlaces' => $to_arr($birth_places),
            'deathPlaces' => $to_arr($death_places),
            'residences'  => $to_arr($residences),
        );
    }

    /**
     * Get all statistics as a single payload
     */
    public function get_all_stats() {
        return array(
            'gender'              => $this->get_gender_stats(),
            'living'              => $this->get_living_stats(),
            'ageGroups'           => $this->get_age_groups(),
            'oldestLiving'        => $this->get_oldest_living(),
            'youngestLiving'      => $this->get_youngest_living(),
            'birthMonths'         => $this->get_birth_months(),
            'zodiacSigns'         => $this->get_zodiac_signs(),
            'birthDecades'        => $this->get_birth_decades(),
            'relationshipNetwork' => $this->get_relationship_network(),
            'childrenStats'       => $this->get_children_stats(),
            'placesStats'         => $this->get_places_stats(),
        );
    }

    /**
     * Register REST routes
     */
    public function register_rest_routes() {
        register_rest_route('chapaneri/v1', '/statistics', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'rest_get_statistics'),
            'permission_callback' => '__return_true',
        ));
    }

    public function rest_get_statistics() {
        return rest_ensure_response($this->get_all_stats());
    }
}

Chapaneri_Statistics_Calculator::instance();
