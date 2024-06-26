package com.java5.assignment.jpa;

import com.java5.assignment.entities.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    @Query(value = "SELECT " +
            "ROW_NUMBER() OVER (ORDER BY o.OrderDate DESC) AS ID, " +
            "o.OrderDate AS Time, " +
            "COUNT(DISTINCT o.OrderID) AS NumberOfInvoices, " +
            "ISNULL(SUM(od.Quantity), 0) AS NumberOfProductsSold, " +
            "ISNULL(SUM(od.Quantity * od.Price), 0) AS TotalRevenue " +
            "FROM Orders o " +
            "LEFT JOIN OrderDetails od ON o.OrderID = od.OrderID " +
            "GROUP BY o.OrderDate " +
            "ORDER BY o.OrderDate;",
            nativeQuery = true)
    List<Object[]> findDailyOrderStatistics();

    @Query(value = "select od from OrderDetail od where od.orderID.id = :oid")
    List<OrderDetail> findAllByOrderID(@Param("oid") long id);

    @Query(value = "select sum(od.quantity) from OrderDetail od where od.orderID.orderStatus != 'Delivered'")
    long countProductSold();

    @Query(value = "select sum(od.quantity) from OrderDetail od where od.orderID.orderStatus != 'Shipping'")
    long countProductShipping();

}