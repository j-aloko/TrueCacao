'use client';

import React, { useCallback, useEffect, useMemo } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';

import CounterField from '@/components/counter-field/CounterField';
import CustomTabs from '@/components/custom-tabs/CustomTabs';
import ProductDetailedDescription from '@/components/product-detailed-description/ProductDetailedDescription';
import ProductImage from '@/components/product-image/ProductImage';
import ProductName from '@/components/product-name/ProductName';
import ProductPrice from '@/components/product-price/ProductPrice';
import ProductSummarizedDescription from '@/components/product-summarized-description/ProductSummarizedDescription';
import RenderProductButtons from '@/components/render-product-buttons/RenderProductButtons';
import Review from '@/components/Review/Review';
import TabHeading from '@/components/tab-heading/TabHeading';
import TextBlock from '@/components/text-block/TextBlock';
import { useCart } from '@/hooks/useCart';
import { useProductSelection } from '@/hooks/useProductSelection';
import { formatString } from '@/util/formatString';
import { getNestedProperty } from '@/util/getNestedProperty';

import PurchasePerksContainer from '../purchase-perks-container/PurchasePerksContainer';
import ReviewsContainer from '../reviews-container/ReviewsContainer';

function ProductDetailsContainer({
  product,
  variantProps,
  labels,
  disableOptions = {},
}) {
  const {
    state: {
      allVariantProperties,
      selectedVariant,
      quantity,
      availableVariantProperties,
    },
    initializeState,
    selectVariantProperty,
    incrementQuantity,
    decrementQuantity,
  } = useProductSelection();

  const {
    addItem,
    loading: cartLoading,
    loadingStates: { add: addingItemToCart },
  } = useCart();

  const tabs = useMemo(
    () => [
      {
        content: (
          <ProductDetailedDescription
            detailedDescription={product.descriptionHtml}
          />
        ),
        heading: <TabHeading name="Product Details" />,
        label: 'Description',
      },
      {
        content: <ReviewsContainer />,
        heading: <TabHeading name="Customer Reviews" />,
        label: 'Reviews',
      },
    ],
    [product.descriptionHtml]
  );

  // Initialize state on component mount
  useEffect(() => {
    if (product.variants.length && !selectedVariant) {
      initializeState(product, variantProps);
    }
  }, [initializeState, product, selectedVariant, variantProps]);

  const handleVariantPropertySelect = useCallback(
    (property, value) => {
      selectVariantProperty(
        product,
        variantProps,
        selectedVariant,
        property,
        value
      );
    },
    [product, selectedVariant, selectVariantProperty, variantProps]
  );

  const onAddToCart = useCallback(() => {
    addItem({
      productVariant: {
        ...selectedVariant,
        product,
      },
      quantity,
    });
  }, [addItem, selectedVariant, product, quantity]);

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Stack spacing={10}>
        <Grid container spacing={2}>
          <Grid size={7} p={2}>
            <ProductImage image="/product-images/royale-cocoa-powder-3.jpg" />
          </Grid>
          <Grid size={5} p={2}>
            <Stack spacing={3}>
              <Stack spacing={2}>
                <ProductName name={product?.name} />
                <Box display="flex" alignItems="center" gap={2}>
                  <Review
                    value={product.averageRating}
                    precision={product.averageRatingPrecision}
                  />
                  <TextBlock
                    text={`${product.averageRating} (${product.totalReviews} reviews)`}
                    variant="body2"
                    component="span"
                  />
                </Box>
                <ProductPrice
                  price={`${selectedVariant?.price?.currencyCode}${selectedVariant?.price?.amount || 0}`}
                />
                <ProductSummarizedDescription
                  summary={product.descriptionSummary}
                />
              </Stack>
              <Divider />
              <Stack spacing={2}>
                {variantProps.map((prop) => (
                  <Stack key={prop} spacing={2}>
                    <TextBlock
                      text={`Choose ${labels[prop.split('.')[0]] || prop}`}
                      variant="subtitle2"
                      sx={{ fontWeight: 500 }}
                    />
                    <Box
                      sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
                      direction="row"
                    >
                      {allVariantProperties[prop]?.map((value) => (
                        <Chip
                          key={value}
                          label={
                            typeof value === 'string'
                              ? formatString(value)
                              : `${value}g`
                          }
                          color={
                            getNestedProperty(selectedVariant, prop) === value
                              ? 'primary'
                              : 'default'
                          }
                          onClick={() =>
                            handleVariantPropertySelect(prop, value)
                          }
                          disabled={
                            disableOptions[prop.split('.')[0]] && // Check if disabling is enabled for this property
                            !availableVariantProperties[prop]?.includes(value) // Check if the option is unavailable
                          }
                        />
                      ))}
                    </Box>
                  </Stack>
                ))}
              </Stack>
              <Divider />
              <Box
                display="flex"
                alignItems="center"
                columnGap={2}
                rowGap={2}
                flex={1}
              >
                <Box flex={0.4}>
                  <CounterField
                    quantity={quantity}
                    onIncrement={incrementQuantity}
                    onDecrement={decrementQuantity}
                  />
                </Box>
                <Box
                  flex={0.6}
                  display="flex"
                  justifyContent={{ md: 'center', sm: 'flex-end' }}
                >
                  <RenderProductButtons
                    onAddToCart={onAddToCart}
                    submitting={cartLoading}
                    addingItem={addingItemToCart}
                  />
                </Box>
              </Box>
              <Divider />
              <PurchasePerksContainer />
            </Stack>
          </Grid>
        </Grid>
        <Box p={2}>
          <CustomTabs tabs={tabs} tabSx={{ fontWeight: 'bold' }} />
        </Box>
      </Stack>
    </Box>
  );
}

export default React.memo(ProductDetailsContainer);
