// ============================================================
// Job Board / Gig Marketplace Screen
// ============================================================
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Briefcase, MapPin, DollarSign, Clock, Search, Filter, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { Button } from '../../src/components/atoms';

const MOCK_JOBS = [
    { id: '1', title: 'Senior UI/UX Designer', company: 'TechFlow', location: 'Remote', salary: '$80k - $120k', type: 'Full-time', logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3aa?w=100' },
    { id: '2', title: 'Brand Identity Design', company: 'Nova Studio', location: 'London, UK', salary: '$4k - $6k', type: 'Gig/Project', logo: 'https://images.unsplash.com/photo-1572021335469-31716248d16c?w=100' },
    { id: '3', title: 'Product Designer (Contract)', company: 'Aakar Creative', location: 'Remote', salary: '$60/hr', type: 'Contract', logo: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=100' },
    { id: '4', title: 'Junior Illustrator', company: 'SketchBook', location: 'New York, US', salary: '$45k - $55k', type: 'Full-time', logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100' },
];

export default function JobBoardScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const [query, setQuery] = useState('');

    const renderJobItem = ({ item }: { item: typeof MOCK_JOBS[0] }) => (
        <TouchableOpacity style={[styles.jobCard, { backgroundColor: colors.surface }]} activeOpacity={0.7}>
            <View style={styles.jobHeader}>
                <Image source={{ uri: item.logo }} style={styles.companyLogo} />
                <View style={{ flex: 1 }}>
                    <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
                    <Text style={[styles.companyName, { color: colors.textSecondary }]}>{item.company}</Text>
                </View>
                <TouchableOpacity><Briefcase size={20} color={colors.textMuted} /></TouchableOpacity>
            </View>

            <View style={styles.jobMeta}>
                <View style={styles.metaBadge}>
                    <MapPin size={14} color={colors.textSecondary} />
                    <Text style={[styles.metaText, { color: colors.textSecondary }]}>{item.location}</Text>
                </View>
                <View style={styles.metaBadge}>
                    <DollarSign size={14} color={colors.textSecondary} />
                    <Text style={[styles.metaText, { color: colors.textSecondary }]}>{item.salary}</Text>
                </View>
                <View style={styles.metaBadge}>
                    <Clock size={14} color={colors.textSecondary} />
                    <Text style={[styles.metaText, { color: colors.textSecondary }]}>{item.type}</Text>
                </View>
            </View>

            <View style={styles.jobFooter}>
                <Text style={[styles.timeAgo, { color: colors.textMuted }]}>Posted 2h ago</Text>
                <Button title="Apply Now" onPress={() => { }} size="sm" style={{ paddingHorizontal: 20 }} />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Job Board</Text>
                <TouchableOpacity>
                    <Filter size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Search size={18} color={colors.textMuted} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search for roles, companies..."
                        placeholderTextColor={colors.textMuted}
                        value={query}
                        onChangeText={setQuery}
                    />
                </View>
            </View>

            <FlatList
                data={MOCK_JOBS}
                renderItem={renderJobItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                ListHeaderComponent={
                    <View style={styles.listHeader}>
                        <Text style={[styles.listTitle, { color: colors.text }]}>Featured Opportunities</Text>
                        <Text style={[styles.listSubtitle, { color: colors.textSecondary }]}>{MOCK_JOBS.length} jobs matched your profile</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
    title: { fontSize: 22, fontWeight: '900' },
    searchContainer: { paddingHorizontal: 20, marginBottom: 16 },
    searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 14, height: 44, borderWidth: 1, gap: 8 },
    searchInput: { flex: 1, fontSize: 15, height: '100%' },
    listHeader: { marginBottom: 20 },
    listTitle: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
    listSubtitle: { fontSize: 13 },
    jobCard: { padding: 16, borderRadius: 20, marginBottom: 16, elevation: 2, shadowOpacity: 0.05, shadowRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 } },
    jobHeader: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    companyLogo: { width: 44, height: 44, borderRadius: 10 },
    jobTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
    companyName: { fontSize: 13, fontWeight: '600' },
    jobMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
    metaBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.03)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    metaText: { fontSize: 12, fontWeight: '600' },
    jobFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 12 },
    timeAgo: { fontSize: 12 },
});
