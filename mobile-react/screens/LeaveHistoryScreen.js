import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';
import { attendanceService } from '../api/services';
import { Calendar, Filter, ChevronRight, Clock, CheckCircle2, XCircle, AlertCircle, ChevronLeft } from 'lucide-react-native';
import { format } from 'date-fns';

export default function LeaveHistoryScreen({ navigation }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchHistory = async () => {
        try {
            const data = await attendanceService.getLeaveRequests();
            setHistory(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchHistory();
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return { bg: '#ecfdf5', text: '#059669', icon: <CheckCircle2 size={14} color="#059669" /> };
            case 'rejected': return { bg: '#fef2f2', text: '#dc2626', icon: <XCircle size={14} color="#dc2626" /> };
            default: return { bg: '#fff7ed', text: '#d97706', icon: <AlertCircle size={14} color="#d97706" /> };
        }
    };

    const renderItem = ({ item }) => {
        const status = getStatusStyle(item.status);
        return (
            <TouchableOpacity style={styles.historyCard}>
                <View style={styles.cardTop}>
                    <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>{item.type?.toUpperCase() || 'LEAVE'}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                        {status.icon}
                        <Text style={[styles.statusText, { color: status.text }]}>{item.status || 'Pending'}</Text>
                    </View>
                </View>

                <View style={styles.cardMiddle}>
                    <View style={styles.dateBlock}>
                        <Calendar size={16} color={COLORS.textLight} />
                        <Text style={styles.dateText}>
                            {format(new Date(item.start_date), 'dd MMM')} - {format(new Date(item.end_date), 'dd MMM yyyy')}
                        </Text>
                    </View>
                </View>

                <View style={styles.cardBottom}>
                    <Text style={styles.reasonText} numberOfLines={2}>"{item.reason}"</Text>
                    {item.created_at && (
                        <Text style={styles.createdAtText}>Diajukan {format(new Date(item.created_at), 'dd/MM/yyyy')}</Text>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Riwayat Pengajuan</Text>
                <TouchableOpacity style={styles.filterBtn}>
                    <Filter size={20} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={history}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconCircle}>
                            <Calendar size={40} color={COLORS.textLight} />
                        </View>
                        <Text style={styles.emptyTitle}>Belum Ada Riwayat</Text>
                        <Text style={styles.emptySubtitle}>Semua pengajuan izin Anda akan muncul di sini.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        backgroundColor: COLORS.surface,
        ...SHADOWS.soft,
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
    filterBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 24,
        paddingBottom: 100,
    },
    historyCard: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusXXL,
        padding: 20,
        marginBottom: 16,
        ...SHADOWS.soft,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    typeBadge: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    typeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.text,
        letterSpacing: 1,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardMiddle: {
        marginBottom: 16,
    },
    dateBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    dateText: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.text,
    },
    cardBottom: {
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 16,
    },
    reasonText: {
        fontSize: 14,
        color: COLORS.textLight,
        fontStyle: 'italic',
        lineHeight: 20,
    },
    createdAtText: {
        fontSize: 11,
        color: COLORS.textLight,
        marginTop: 12,
        textAlign: 'right',
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
        lineHeight: 20,
    },
});
