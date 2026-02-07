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
} from "@mui/material";
import { CrudService } from "../../services/CrudService";
import { OrderDetails } from "../../services/Model";
import BackButton from "../../components/common/BackButton";

// 🔹 Report model
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

    // ---------------- LOAD ORDERS ----------------
    useEffect(() => {
        crud.getOrders().then((res: any[]) => {
            const safeOrders = Array.isArray(res) ? res : [];
            setOrders(safeOrders);
        });
    }, []);

    const isWithinRange = (dateStr: string, range: RangeType) => {
        const orderDate = new Date(dateStr);
        const now = new Date();

        // Normalize dates (remove time)
        const order = new Date(
            orderDate.getFullYear(),
            orderDate.getMonth(),
            orderDate.getDate()
        );

        const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        const diffDays =
            (today.getTime() - order.getTime()) / (1000 * 60 * 60 * 24);

        // DAILY
        if (range === "daily") {
            return diffDays === 0;
        }

        // WEEKLY (last 7 days)
        if (range === "weekly") {
            return diffDays >= 0 && diffDays <= 7;
        }

        // CALENDAR MONTH (current month only)
        if (range === "monthly") {
            return (
                order.getMonth() === today.getMonth() &&
                order.getFullYear() === today.getFullYear()
            );
        }

        // 🔥 ROLLING MONTHS (KEY PART)
        const monthsMap: Record<string, number> = {
            last1: 1,
            last2: 2,
            last3: 3,
            last6: 6,
        };

        if (range in monthsMap) {
            const monthsBack = monthsMap[range];
            const fromDate = new Date(today);
            fromDate.setMonth(fromDate.getMonth() - monthsBack);

            return order >= fromDate && order <= today;
        }

        return false;
    };


    // ---------------- REPORT GENERATION ----------------
    const generateReport = (): FoodSalesReport[] => {
        const deliveredOrders = orders.filter(
            (o) => o.status === "Delivered" && isWithinRange(o.date, range)
        );

        const map: Record<string, FoodSalesReport> = {};

        deliveredOrders.forEach((o) => {
            if (!map[o.foodname]) {
                map[o.foodname] = {
                    foodname: o.foodname,
                    price: o.price,
                    totalOrders: 0,
                    totalQuantity: 0,
                    totalRevenue: 0,
                };
            }

            map[o.foodname].totalOrders += 1;
            map[o.foodname].totalQuantity += o.quantity;
            map[o.foodname].totalRevenue += o.price * o.quantity;
        });

        return Object.values(map);
    };

    const report = generateReport();

    // ---------------- CSV DOWNLOAD ----------------
    const downloadCSV = () => {
        if (report.length === 0) return;

        const headers = [
            "Food Name",
            "Price",
            "Total Orders",
            "Total Quantity",
            "Total Revenue",
        ];

        const rows = report.map((r) => [
            r.foodname,
            r.price,
            r.totalOrders,
            r.totalQuantity,
            r.totalRevenue,
        ]);

        const csvContent =
            [headers, ...rows].map((row) => row.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `sales-report-${range}.csv`;
        a.click();
    };

    const totalRevenue = report.reduce(
        (sum, r) => sum + r.totalRevenue,
        0
    );

    return (
        <Box
            p={3}
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #fff7ed, #ffe0d1)",
            }}
        >
            <BackButton to="/adminorders" />

            <Typography
                variant="h4"
                fontWeight="bold"
                align="center"
                mb={3}
                sx={{
                    background: "linear-gradient(135deg, #ff5722, #ff9800)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
            >
                Sales Report
            </Typography>

            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="center"
                alignItems="center"
                spacing={3}          // 👈 GAP BETWEEN ITEMS
                mb={3}
            >
                {/* DAILY / WEEKLY */}
                <Paper
                    elevation={3}
                    sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 3,
                    }}
                >
                    <ToggleButtonGroup
                        value={["daily", "weekly"].includes(range) ? range : null}
                        exclusive
                        onChange={(_, val) => val && setRange(val)}
                        sx={{
                            "& .MuiToggleButton-root": {
                                px: 3,
                                textTransform: "none",
                                fontWeight: 600,
                            },
                        }}
                    >
                        <ToggleButton value="daily" sx={{
                            color: "#20a8e7",
                            borderColor: "#f1f8f2",
                            "&.Mui-selected": {
                                backgroundColor: "#e60f0f",
                                color: "#fff",
                                "&:hover": {
                                    backgroundColor: "#1b5e20",
                                },
                            },
                        }}>Daily</ToggleButton>
                        <ToggleButton value="weekly" sx={{
                            color: "#d32f2f",
                            borderColor: "#f4efef",
                            "&.Mui-selected": {
                                backgroundColor: "#e60f0f",
                                color: "#fff",
                                "&:hover": {
                                    backgroundColor: "#1b5e20",
                                },
                            },
                        }} >Weekly</ToggleButton>
                    </ToggleButtonGroup>
                </Paper>

                {/* MONTH SELECTOR */}
                <Paper
                    elevation={3}
                    sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 3,
                    }}
                >
                    <Autocomplete
                        options={monthOptions}
                        sx={{ width: 260 }}
                        getOptionLabel={(option) => option.label}
                        value={monthOptions.find((o) => o.value === range) || null}
                        onChange={(_, newValue) => {
                            if (newValue) setRange(newValue.value as RangeType);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Month Range"
                                size="small"
                            />
                        )}
                    />
                </Paper>
            </Stack>


            {/* SUMMARY */}
            <Typography align="center" fontWeight="bold" mb={2}>
                Total Revenue: ₹{totalRevenue}
            </Typography>

            {/* TABLE */}
            <Paper sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#ff9800" }}>
                            <TableCell sx={{ color: "#fff" }}>Food</TableCell>
                            <TableCell sx={{ color: "#fff" }}>Price</TableCell>
                            <TableCell sx={{ color: "#fff" }}>Orders</TableCell>
                            <TableCell sx={{ color: "#fff" }}>Quantity Sold</TableCell>
                            <TableCell sx={{ color: "#fff" }}>Revenue</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {report.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            report.map((r) => (
                                <TableRow key={r.foodname} hover>
                                    <TableCell>{r.foodname}</TableCell>
                                    <TableCell>₹{r.price}</TableCell>
                                    <TableCell>{r.totalOrders}</TableCell>
                                    <TableCell>{r.totalQuantity}</TableCell>
                                    <TableCell>₹{r.totalRevenue}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <Box textAlign="right" mt={2}>
                    <Button
                        variant="contained"
                        onClick={downloadCSV}
                        sx={{
                            background: "linear-gradient(135deg, #4caf50, #2e7d32)",
                        }}
                    >
                        Download CSV
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
