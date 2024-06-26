var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
    $scope.promotions = [];
    $scope.selectedPromotion = null;
    $scope.selectedDiscountLevel = null;
    $scope.selectedStartDate = null;
    $scope.selectedEndDate = null;
    $scope.discountLevels = [];
    $scope.selectedProducts = [];
    $scope.filterName = '';
    $scope.filterCategory = null;
    $scope.filterBrand = null;
    $scope.sortOption = 'id_asc';

    $scope.categories = [];
    $scope.brands = [];

    $http.get('/api/get-all-discount')
        .then(function(response) {
            $scope.promotions = response.data;
            initializeFilters($scope.promotions);
        })
        .catch(function(error) {
            console.error('Error fetching promotions:', error);
        });

    function initializeFilters(promotions) {
        let uniqueCategories = new Map();
        let uniqueBrands = new Map();

        promotions.forEach(promotion => {
            promotion.promotionDetails.forEach(detail => {
                detail.promotionProducts.forEach(product => {
                    let categoryKey = product.productVersionID.productID.categoryID.id;
                    let brandKey = product.productVersionID.productID.brandID.id;

                    if (!uniqueCategories.has(categoryKey)) {
                        uniqueCategories.set(categoryKey, product.productVersionID.productID.categoryID);
                    }

                    if (!uniqueBrands.has(brandKey)) {
                        uniqueBrands.set(brandKey, product.productVersionID.productID.brandID);
                    }
                });
            });
        });

        $scope.categories = Array.from(uniqueCategories.values());
        $scope.brands = Array.from(uniqueBrands.values());
    }

    $scope.updatePromotionDetails = function() {
        if ($scope.selectedPromotion) {
            $scope.selectedStartDate = new Date($scope.selectedPromotion.startDate);
            $scope.selectedEndDate = new Date($scope.selectedPromotion.endDate);

            let uniqueLevels = new Set();
            $scope.selectedPromotion.promotionDetails.forEach(detail => {
                uniqueLevels.add(detail.discountLevel);
            });

            $scope.discountLevels = Array.from(uniqueLevels);
            $scope.selectedDiscountLevel = null;
            $scope.selectedProducts = [];
        }
    };

    $scope.updateProductDetails = function() {
        if ($scope.selectedPromotion && $scope.selectedDiscountLevel !== null) {
            let selectedDetail = $scope.selectedPromotion.promotionDetails.find(detail => detail.discountLevel === $scope.selectedDiscountLevel);
            if (selectedDetail) {
                $scope.selectedProducts = selectedDetail.promotionProducts.map(product => ({
                    id: product.productVersionID.id,
                    category: product.productVersionID.productID.categoryID,
                    brand: product.productVersionID.productID.brandID,
                    name: product.productVersionID.versionName,
                    price: product.productVersionID.price,
                    quantity: product.productVersionID.quantity,
                }));
            }

            // Check if selectedDiscountLevel is in datalistOptions
            let foundInDatalist = $scope.discountLevels.includes($scope.selectedDiscountLevel.toString());

            // Show Create button only if selectedDiscountLevel is not found in datalistOptions
            $scope.showCreateButton = !foundInDatalist;
        }
    };

    $scope.customFilter = function(product) {
        return (!$scope.filterName || product.name.toLowerCase().includes($scope.filterName.toLowerCase())) &&
            (!$scope.filterCategory || product.category.id === $scope.filterCategory.id) &&
            (!$scope.filterBrand || product.brand.id === $scope.filterBrand.id);
    };

    $scope.sortFunction = function(product) {
        switch ($scope.sortOption) {
            case 'id_asc':
                return product.id;
            case 'id_desc':
                return -product.id;
            case 'name_asc':
                return product.name.toLowerCase();
            case 'name_desc':
                return -product.name.toLowerCase();
            default:
                return product.id;
        }
    };

    $scope.isEditMode = function() {
        return $scope.selectedDiscountLevel !== null;
    };

    $scope.clearFilters = function() {
        $scope.filterName = '';
        $scope.filterCategory = null;
        $scope.filterBrand = null;
        $scope.sortOption = 'id_asc';
    };

    $scope.createDiscount = function() {
        // Check if selectedPromotion and selectedDiscountLevel are valid
        if ($scope.selectedPromotion && $scope.selectedDiscountLevel !== null) {
            // Perform API call to add new promotion detail
            $http.post('/api/add-new-promotion-detail', null, {
                params: {
                    promotionID: $scope.selectedPromotion.id,
                    DiscountLevel: $scope.selectedDiscountLevel
                }
            }).then(function(response) {
                // API call success
                if (response.data) {
                    // Show success notification modal
                    $scope.notifiMessage = "Promotion detail added successfully.";
                } else {
                    // Show failure notification modal
                    $scope.notifiMessage = "Failed to add promotion detail. Please try again.";
                }
                $scope.showNotificationModal();
            }).catch(function(error) {
                // API call failed
                console.error('Error adding promotion detail:', error);
                $scope.notifiMessage = "Failed to add promotion detail due to server error. Please try again later.";
                $scope.showNotificationModal();
            });
        }
    };

    $scope.showNotificationModal = function () {
        var modal = new bootstrap.Modal(document.getElementById('notificationModal'));
        modal.show();

        // Close modal after a certain period of time
        setTimeout(function () {
            modal.hide();
        }, 3000);
    };
});
