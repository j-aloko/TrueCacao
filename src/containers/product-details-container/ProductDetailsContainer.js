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
import {
  decrementQuantity,
  incrementQuantity,
  selectVariantProperty,
  setInitialState,
} from '@/services/redux/features/product-selection/productSelectionSlice';
import { useAppDispatch, useAppSelector } from '@/services/redux/store';
import { formatString } from '@/util/formatString';
import { getNestedProperty } from '@/util/getNestedProperty';

import PurchasePerksContainer from '../purchase-perks-container/PurchasePerksContainer';
import ReviewsContainer from '../reviews-container/ReviewsContainer';

const summarizedProductDescription =
  'Our 100% pure, unprocessed cocoa powder is made from premium organic cocoa beans. Cold-pressed to preserve nutrients, it delivers a rich chocolate flavor with all the natural health benefits intact. Perfect for baking, smoothies, or making hot chocolate.';

const htmlProductDescription = `
<div>
    <p>Our Raw Organic Cocoa Powder is made from carefully selected premium cocoa beans that are
        cold-pressed to remove the cocoa butter. This gentle process preserves the natural
        enzymes and nutrients, resulting in a nutrient-dense powder with a rich, intense
        chocolate flavor.</p>
    <p><strong>Ingredients:</strong> 100% organic raw cocoa powder</p>
    <p><strong>Net Weight:</strong> 8 oz (227g)</p>
    <p><strong>Origin:</strong> Sustainably sourced from small farms in Ecuador</p>
</div>
`;

const htmlBenefits = `
<ul>
    <li>Rich in antioxidants (flavonoids and polyphenols)</li>
    <li>May help lower blood pressure</li>
    <li>Contains mood-enhancing compounds like theobromine</li>
    <li>Good source of magnesium, iron, and fiber</li>
    <li>May improve brain function and reduce stress</li>
</ul>
`;

function ProductDetailsContainer({
  product,
  variantProps,
  labels,
  disableOptions = {},
}) {
  const dispatch = useAppDispatch();
  const {
    allVariantProperties,
    selectedVariant,
    quantity,
    availableVariantProperties,
  } = useAppSelector((state) => state.productSelection);

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
            detailedDescription={htmlProductDescription}
          />
        ),
        heading: <TabHeading name="Product Details" />,
        label: 'Description',
      },
      {
        content: (
          <ProductDetailedDescription detailedDescription={htmlBenefits} />
        ),
        heading: <TabHeading name={`Health Benefits of ${product.name}`} />,
        label: 'Health Benefits',
      },
      {
        content: <ReviewsContainer />,
        heading: <TabHeading name="Customer Reviews" />,
        label: 'Reviews',
      },
    ],
    [product.name]
  );

  // Initialize state on component mount
  useEffect(() => {
    if (product.variants.length && !selectedVariant) {
      // Extract all unique values for each variant property
      const initialVariantProperties = variantProps.reduce((acc, prop) => {
        acc[prop] = [
          ...new Set(product.variants.map((v) => getNestedProperty(v, prop))),
        ];
        return acc;
      }, {});

      const defaultVariant =
        product.variants.find((v) => v.stock > 0) || product.variants[0];

      // Calculate available variant properties based on the default variant
      const initialAvailableVariantProperties = variantProps.reduce(
        (acc, prop) => {
          acc[prop] = product.variants
            .filter((v) =>
              // Check if the variant matches all other selected properties
              variantProps.every((p) => {
                if (p === prop) return true; // Skip the current property
                return (
                  getNestedProperty(v, p) ===
                  getNestedProperty(defaultVariant, p)
                );
              })
            )
            .map((v) => getNestedProperty(v, prop));
          return acc;
        },
        {}
      );

      // Dispatch the initial state to Redux
      dispatch(
        setInitialState({
          allVariantProperties: initialVariantProperties,
          availableVariantProperties: initialAvailableVariantProperties,
          quantity: 1,
          selectedVariant: defaultVariant,
          selectedVariantProperties: variantProps.reduce((acc, prop) => {
            acc[prop] = getNestedProperty(defaultVariant, prop);
            return acc;
          }, {}),
        })
      );
    }
  }, [dispatch, product, selectedVariant, variantProps]);

  const handleVariantPropertySelect = useCallback(
    (property, value) => {
      // Find all variants that match the new property value
      const validVariants = product.variants.filter(
        (v) => getNestedProperty(v, property) === value
      );

      // Find the variant that matches the new property value and other selected properties
      const foundVariant =
        validVariants.find((v) =>
          variantProps.every((p) => {
            if (p === property) return true; // Skip the current property
            return (
              getNestedProperty(v, p) === getNestedProperty(selectedVariant, p)
            );
          })
        ) || validVariants[0]; // Fallback to the first valid variant if no exact match is found

      // Calculate available values for each property based on the found variant
      const availableValues = variantProps.reduce((acc, prop) => {
        acc[prop] = [
          ...new Set(
            product.variants
              .filter((v) =>
                variantProps.every((p) => {
                  if (p === prop) return true; // Skip the current property
                  return (
                    getNestedProperty(v, p) ===
                    getNestedProperty(foundVariant, p)
                  );
                })
              )
              .map((v) => getNestedProperty(v, prop))
          ),
        ];
        return acc;
      }, {});

      dispatch(
        selectVariantProperty({
          availableValues,
          property,
          value,
          variant: foundVariant,
        })
      );
    },
    [dispatch, product.variants, selectedVariant, variantProps]
  );

  const handleIncrement = () => dispatch(incrementQuantity());
  const handleDecrement = () => dispatch(decrementQuantity());

  const onAddToCart = () =>
    addItem({
      productVariant: {
        ...selectedVariant,
        product,
      },
      quantity,
    });

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
                  <Review value={4.5} />
                  <TextBlock
                    text={`${4.5} (${128} reviews)`}
                    variant="body2"
                    component="span"
                  />
                </Box>
                <ProductPrice
                  price={`${selectedVariant?.price?.currencyCode}${selectedVariant?.price?.amount || 0}`}
                />
                <ProductSummarizedDescription
                  summary={summarizedProductDescription}
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
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
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
