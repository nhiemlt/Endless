package com.java5.assignment.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Table(name = "Vouchers")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VoucherID", nullable = false)
    private Long id;

    @Size(max = 50)
    @NotNull
    @Nationalized
    @Column(name = "VoucherCode", nullable = false, length = 50)
    private String voucherCode;

    @NotNull
    @Column(name = "LeastBill", nullable = false, precision = 18, scale = 2)
    private BigDecimal leastBill;

    @NotNull
    @Column(name = "LeastDiscount", nullable = false, precision = 18, scale = 2)
    private BigDecimal leastDiscount;

    @NotNull
    @Column(name = "BiggestDiscount", nullable = false, precision = 18, scale = 2)
    private BigDecimal biggestDiscount;

    @NotNull
    @Column(name = "DiscountLevel", nullable = false)
    private Integer discountLevel;

    @Size(max = 50)
    @NotNull
    @Nationalized
    @Column(name = "DiscountForm", nullable = false, length = 50)
    private String discountForm;

    @NotNull
    @Column(name = "StartDate", nullable = false)
    private LocalDate startDate;

    @NotNull
    @Column(name = "EndDate", nullable = false)
    private LocalDate endDate;

    @OneToMany(mappedBy = "voucherID")
    private Set<Order> orders = new LinkedHashSet<>();

    @OneToMany(mappedBy = "voucherID")
    private Set<UserVoucher> userVouchers = new LinkedHashSet<>();

}