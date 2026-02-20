import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    Stack,
    Autocomplete,
    TextField,
    Divider,
    Container,
    Avatar,
} from "@mui/material";
import InventoryIcon from '@mui/icons-material/Inventory';
import PaymentsIcon from '@mui/icons-material/Payments';
import DownloadIcon from '@mui/icons-material/Download';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { CrudService } from "../../services/CrudService";
import { OrderDetails } from "../../services/Model";
import BackButton from "../../components/common/BackButton";

// Same Logic Models & Types
interface FoodSalesReport {
    foodname: string;
    price: number;
    totalOrders: number;
    totalQuantity: number;
    totalRevenue: number;
}

type RangeType = "daily" | "weekly" | "monthly" | "last1" | "last2" | "last3" | "last6";

const monthOptions = [
    { label: "This Month", value: "monthly" },
    { label: "Last 1 Month", value: "last1" },
    { label: "Last 2 Months", value: "last2" },
    { label: "Last 3 Months", value: "last3" },
    { label: "Last 6 Months", value: "last6" },
];

export default function AdminSalesReport() {
    const crud = CrudService();
    const [orders, setOrders] = useState<OrderDetails[]>([]);
    const [range, setRange] = useState<RangeType>("daily");

    useEffect(() => {
        crud.getOrders().then((res: any[]) => {
            const safeOrders = Array.isArray(res) ? res : [];
            setOrders(safeOrders);
        });
    }, []);

    // Logic untouched as per request
    const isWithinRange = (dateStr: string, range: RangeType) => {
        const orderDate = new Date(dateStr);
        const now = new Date();
        const order = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const diffDays = (today.getTime() - order.getTime()) / (1000 * 60 * 60 * 24);

        if (range === "daily") return diffDays === 0;
        if (range === "weekly") return diffDays >= 0 && diffDays <= 7;
        if (range === "monthly") return order.getMonth() === today.getMonth() && order.getFullYear() === today.getFullYear();
        
        const monthsMap: Record<string, number> = { last1: 1, last2: 2, last3: 3, last6: 6 };
        if (range in monthsMap) {
            const monthsBack = monthsMap[range as string];
            const fromDate = new Date(today);
            fromDate.setMonth(fromDate.getMonth() - monthsBack);
            return order >= fromDate && order <= today;
        }
        return false;
    };

    const generateReport = (): FoodSalesReport[] => {
        const deliveredOrders = orders.filter((o) => o.status === "Delivered" && isWithinRange(o.date, range));
        const map: Record<string, FoodSalesReport> = {};
        deliveredOrders.forEach((o) => {
            if (!map[o.foodname]) {
                map[o.foodname] = { foodname: o.foodname, price: o.price, totalOrders: 0, totalQuantity: 0, totalRevenue: 0 };
            }
            map[o.foodname].totalOrders += 1;
            map[o.foodname].totalQuantity += o.quantity;
            map[o.foodname].totalRevenue += o.price * o.quantity;
        });
        return Object.values(map);
    };

    const report = generateReport();
    const totalRevenue = report.reduce((sum, r) => sum + r.totalRevenue, 0);
    const totalItemsSold = report.reduce((sum, r) => sum + r.totalQuantity, 0);

    const downloadCSV = () => {
        if (report.length === 0) return;
        const headers = ["Food Name", "Price", "Total Orders", "Total Quantity", "Total Revenue"];
        const rows = report.map((r) => [r.foodname, r.price, r.totalOrders, r.totalQuantity, r.totalRevenue]);
        const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sales-report-${range}.csv`;
        a.click();
    };

    return (
        <Box sx={{ 
            minHeight: "100vh", 
            bgcolor: "#F8F9FB", 
            pb: 8,
            backgroundImage: `url('https://www.transparenttextures.com/patterns/cubes.png')`, // Subtle professional texture
        }}>
            {/* Header Section */}
            <Box sx={{ bgcolor: "#fff", pt: 3, pb: 4, borderBottom: "1px solid #E5E7EB", mb: 4 }}>
                <Container maxWidth="lg">
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <BackButton to="/adminorders" />
                        <Typography variant="h5" fontWeight={800} sx={{ color: "#111827", display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <AssessmentIcon sx={{ color: "#FF5200" }} /> Business Insights
                        </Typography>
                        <Button 
                            variant="outlined" 
                            startIcon={<DownloadIcon />}
                            onClick={downloadCSV}
                            sx={{ borderRadius: "10px", textTransform: 'none', fontWeight: 700, color: "#FF5200", borderColor: "#FF5200" }}
                        >
                            Export CSV
                        </Button>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* Summary Cards */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mb={4}>
                    <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<PaymentsIcon />} color="#FF5200" />
                    <StatCard title="Items Delivered" value={totalItemsSold} icon={<InventoryIcon />} color="#00B8D9" />
                    <StatCard title="Active Range" value={range.toUpperCase()} icon={<AssessmentIcon />} color="#36B37E" />
                </Stack>

                {/* Filters */}
                <Paper elevation={0} sx={{ p: 2, borderRadius: "16px", border: "1px solid #E5E7EB", mb: 3 }}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
                        <ToggleButtonGroup
                            value={["daily", "weekly"].includes(range) ? range : null}
                            exclusive
                            onChange={(_, val) => val && setRange(val)}
                            sx={{ bgcolor: "#F3F4F6", p: 0.5, borderRadius: "12px" }}
                        >
                            <ToggleButton value="daily" sx={toggleStyle}>Daily</ToggleButton>
                            <ToggleButton value="weekly" sx={toggleStyle}>Weekly</ToggleButton>
                        </ToggleButtonGroup>

                        <Autocomplete
                            options={monthOptions}
                            sx={{ width: 280 }}
                            getOptionLabel={(option) => option.label}
                            value={monthOptions.find((o) => o.value === range) || null}
                            onChange={(_, newValue) => {
                                if (newValue) setRange(newValue.value as RangeType);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Filter by Month" size="small" variant="outlined" />
                            )}
                        />
                    </Stack>
                </Paper>

                {/* Report Table */}
                <Paper elevation={0} sx={{ borderRadius: "16px", border: "1px solid #E5E7EB", overflow: "hidden" }}>
                    <Table>
                        <TableHead sx={{ bgcolor: "#F9FAFB" }}>
                            <TableRow>
                                <TableCell sx={headerCellStyle}>FOOD ITEM</TableCell>
                                <TableCell sx={headerCellStyle} align="center">UNIT PRICE</TableCell>
                                <TableCell sx={headerCellStyle} align="center">ORDERS</TableCell>
                                <TableCell sx={headerCellStyle} align="center">QUANTITY</TableCell>
                                <TableCell sx={headerCellStyle} align="right">NET REVENUE</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {report.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 10, color: "#9CA3AF" }}>
                                        No sales recorded for this period.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                report.map((r) => (
                                    <TableRow key={r.foodname} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell sx={{ fontWeight: 700, color: "#374151" }}>{r.foodname}</TableCell>
                                        <TableCell align="center">₹{r.price}</TableCell>
                                        <TableCell align="center">{r.totalOrders}</TableCell>
                                        <TableCell align="center">{r.totalQuantity}</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 800, color: "#111827" }}>₹{r.totalRevenue.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            </Container>
        </Box>
    );
}

// Styled Components & Constants
const toggleStyle = {
    px: 4,
    border: "none !important",
    borderRadius: "10px !important",
    textTransform: "none",
    fontWeight: 700,
    "&.Mui-selected": {
        backgroundColor: "#fff",
        color: "#FF5200",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        "&:hover": { backgroundColor: "#fff" }
    }
};

const headerCellStyle = {
    fontWeight: 800,
    color: "#6B7280",
    fontSize: "0.75rem",
    letterSpacing: "0.05em",
    py: 2
};

const StatCard = ({ title, value, icon, color }: any) => (
    <Paper elevation={0} sx={{ 
        flex: 1, p: 3, borderRadius: "20px", border: "1px solid #E5E7EB",
        display: 'flex', alignItems: 'center', gap: 2.5
    }}>
        <Avatar sx={{ bgcolor: `${color}15`, color: color, width: 56, height: 56 }}>
            {icon}
        </Avatar>
        <Box>
            <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 700, textTransform: 'uppercase' }}>
                {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: "#111827" }}>
                {value}
            </Typography>
        </Box>
    </Paper>
);