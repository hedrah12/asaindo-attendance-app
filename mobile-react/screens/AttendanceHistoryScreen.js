import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, StatusBar, Platform } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';
import { attendanceService } from '../api/services';
import { ChevronLeft, Calendar, Clock, MapPin, Zap, TrendingUp, Filter } from 'lucide-react-native';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export default function AttendanceHistoryScreen({ navigation }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState('all'); // all, regular, overtime

    const fetchHistory = useCallback(async () => {
        try {
            const data = await attendanceService.getHistory();
            setHistory(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchHistory();
    };

    const filteredHistory = history.filter(item => {
        if (filter === 'all') return true;
        if (filter === 'regular') return !item.is_overtime;
        if (filter === 'overtime') return item.is_overtime;
        return true;
    });

    const renderItem = ({ item }) => {
        const isOvertime = item.is_overtime;
        const checkIn = item.check_in ? item.check_in.substring(0, 5) : '--:--';
        const checkOut = item.check_out ? item.check_out.substring(0, 5) : '--:--';
        const dateFormatted = format(parseISO(item.date), 'dd MMM yyyy', { locale: id });

        return (
            <View style={styles.historyCard}>
                <View style={styles.cardHeader}>
                    <View style={styles.dateInfo}>
                        <Calendar size={16} color={COLORS.textLight} />
                        <Text style={styles.dateText}>{dateFormatted}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: isOvertime ? '#fdf4ff' : '#f0fdf4' }]}>
                        {isOvertime ? <TrendingUp size={12} color="#a21caf" /> : <Zap size={12} color="#15803d" />}
                        <Text style={[styles.badgeText, { color: isOvertime ? '#a21caf' : '#15803d' }]}>
                            {isOvertime ? 'Lembur' : 'Reguler'}
                        </Text>
                    </View>
                </View>

                <View style={styles.cardBody}>
                    <View style={styles.timeSection}>
                        <View style={styles.timeItem}>
                            <Text style={styles.timeLabel}>Masuk</Text>
                            <View style={styles.timeValueRow}>
                                <Clock size={14} color={COLORS.success} />
                                <Text style={styles.timeValue}>{checkIn}</Text>
                            </View>
                        </View>
                        <View style={styles.timeDivider} />
                        <View style={styles.timeItem}>
                            <Text style={styles.timeLabel}>Keluar</Text>
                            <View style={styles.timeValueRow}>
                                <Clock size={14} color={COLORS.danger} />
                                <Text style={styles.timeValue}>{checkOut}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.locationInfo}>
                        <MapPin size={12} color={COLORS.textLight} />
                        <Text style={styles.statusText} numberOfLines={1}>
                            Status: <Text style={{ fontWeight: 'bold', color: COLORS.text }}>{item.status || 'Hadir'}</Text>
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Riwayat Absensi</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterSlots}>
                    <TouchableOpacity
                        style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]}
                        onPress={() => setFilter('all')}
                    >
                        <Text style={[styles.filterLabel, filter === 'all' && styles.filterLabelActive]}>Semua</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterBtn, filter === 'regular' && styles.filterBtnActive]}
                        onPress={() => setFilter('regular')}
                    >
                        <Text style={[styles.filterLabel, filter === 'regular' && styles.filterLabelActive]}>Reguler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterBtn, filter === 'overtime' && styles.filterBtnActive]}
                        onPress={() => setFilter('overtime')}
                    >
                        <Text style={[styles.filterLabel, filter === 'overtime' && styles.filterLabelActive]}>Lembur</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredHistory}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Clock size={64} color={COLORS.border} strokeWidth={1} />
                            <Text style={styles.emptyText}>Belum ada riwayat absensi.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

// Reuse styles from Dashboard/Attendance or create specific ones
import { ScrollView } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        backgroundColor: COLORS.surface,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    filterContainer: {
        backgroundColor: COLORS.surface,
        paddingBottom: 16,
    },
    filterSlots: {
        paddingHorizontal: 24,
        gap: 12,
    },
    filterBtn: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterBtnActive: {
        backgroundColor: '#fff1f2',
        borderColor: COLORS.primaryLight,
    },
    filterLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textLight,
    },
    filterLabelActive: {
        color: COLORS.primary,
    },
    listContent: {
        padding: 24,
        paddingBottom: 120,
    },
    historyCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        ...SHADOWS.soft,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    dateInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dateText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    cardBody: {
        gap: 12,
    },
    timeSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        padding: 12,
    },
    timeItem: {
        flex: 1,
        alignItems: 'center',
    },
    timeLabel: {
        fontSize: 10,
        color: COLORS.textLight,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    timeValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    timeValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    timeDivider: {
        width: 1,
        height: 24,
        backgroundColor: COLORS.border,
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginLeft: 4,
    },
    statusText: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 100,
        gap: 16,
    },
    emptyText: {
        color: COLORS.textLight,
        fontSize: 14,
    }
});
