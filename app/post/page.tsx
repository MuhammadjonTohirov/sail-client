"use client";
import { Suspense } from 'react';
import { useI18n } from '@/lib/i18n';
import { usePostViewModel } from './usePostViewModel';
import { DescribeSection } from './components/DescribeSection';
import { PhotoSection } from './components/PhotoSection';
import { DescriptionSection } from './components/DescriptionSection';
import { DealTypeSection } from './components/DealTypeSection';
import { AdditionalInfoSection } from './components/AdditionalInfoSection';
import { AttributesSection } from './components/AttributesSection';
import { LocationSection } from './components/LocationSection';
import { ContactInfoSection } from './components/ContactInfoSection';
import { FormActions } from './components/FormActions';
import { TelegramChannelSelector } from '@/components/post/TelegramChannelSelector';

const TITLE_MAX_LENGTH = 70;
const DESCRIPTION_MAX_LENGTH = 9000;
const CONTACT_MAX_LENGTH = 255;
const PHONE_MAX_LENGTH = 20;

function PostPageContent() {
  const { t, locale } = useI18n();
  const vm = usePostViewModel();

  if (!vm.mounted) {
    return <div className="page-section page-section--padded post-page" style={{ minHeight: '400px' }}></div>;
  }

  const pageTitle = vm.isEditMode ? t('post.editTitle') : t('post.createTitle');
  const actionDisabled =
    vm.uploading ||
    vm.isCompressing ||
    vm.hasCompressionError ||
    !vm.selectedCat ||
    !vm.locationId ||
    !vm.title ||
    !vm.contactName ||
    (vm.dealType === 'sell' && !vm.negotiable && !vm.price);

  return (
    <div className="page-section page-section--padded post-page" style={{paddingLeft: 20, paddingRight: 20}}>
      <h2>{pageTitle}</h2>
      <div className="form-section">
        <DescribeSection
          t={t}
          title={vm.title}
          maxTitleLength={TITLE_MAX_LENGTH}
          selectedCat={vm.selectedCat}
          selectedCatPath={vm.selectedCatPath}
          categories={vm.categories as any}
          catPickerOpen={vm.catPickerOpen}
          onTitleChange={vm.setTitle}
          onOpenCategoryPicker={() => vm.setCatPickerOpen(true)}
          onCloseCategoryPicker={() => vm.setCatPickerOpen(false)}
          onCategorySelect={vm.onCategorySelect}
        />

        <PhotoSection
          t={t}
          existingMedia={vm.existingMedia}
          files={vm.files}
          maxImages={vm.maxImages}
          maxFileSizeMb={vm.maxFileSizeMb}
          onPickFiles={vm.onPickFiles}
          removeFile={vm.removeFile}
          deleteExistingMedia={vm.deleteExistingMedia}
          handleDragStart={vm.handleDragStart}
          handleDragOver={vm.handleDragOver}
          handleDrop={vm.handleDrop}
        />

        <DescriptionSection
          t={t}
          description={vm.description}
          maxLength={DESCRIPTION_MAX_LENGTH}
          onChange={vm.setDescription}
        />

        <DealTypeSection
          t={t}
          dealType={vm.dealType}
          setDealType={vm.setDealType}
          price={vm.price}
          setPrice={vm.setPrice}
          priceCurrency={vm.priceCurrency}
          setPriceCurrency={vm.setPriceCurrency}
          currencyOptions={vm.currencyOptions}
          negotiable={vm.negotiable}
          setNegotiable={vm.setNegotiable}
        />

        <AdditionalInfoSection
          t={t}
          sellerType={vm.sellerType}
          setSellerType={vm.setSellerType}
          condition={vm.condition}
          setCondition={vm.setCondition}
        />

        <AttributesSection
          t={t}
          show={Boolean(vm.selectedCat && vm.attrs.length > 0)}
          attrs={vm.attrs}
          values={vm.values}
          onChange={vm.setAttrValue}
          locale={locale}
        />

        <LocationSection
          t={t}
          locationPath={vm.locationPath}
          pickerOpen={vm.locationPickerOpen}
          onOpenPicker={() => vm.setLocationPickerOpen(true)}
          onClosePicker={() => vm.setLocationPickerOpen(false)}
          onSelectLocation={vm.onLocationSelect}
        />

        <ContactInfoSection
          t={t}
          contactName={vm.contactName}
          contactEmail={vm.contactEmail}
          contactPhone={vm.contactPhone}
          onChangeName={ text =>
            {
              vm.setContactName(text)
            }
          }
          onChangeEmail={vm.setContactEmail}
          onChangePhone={ text => {
            vm.setContactPhone(text)
          }}
          nameMaxLength={CONTACT_MAX_LENGTH}
          emailMaxLength={CONTACT_MAX_LENGTH}
          phoneMaxLength={PHONE_MAX_LENGTH}
        />

        {!vm.isEditMode && (
          <div className="mb-8">
            <TelegramChannelSelector
              chats={vm.telegramChats}
              selectedChatIds={vm.selectedTelegramChats}
              onChange={vm.setSelectedTelegramChats}
            />
          </div>
        )}

        <FormActions
          t={t}
          uploading={vm.uploading}
          isEditMode={vm.isEditMode}
          disabled={actionDisabled}
          onSubmit={vm.onSubmit}
          error={vm.error}
        />
      </div>
    </div>
  );
}

function LoadingFallback() {
  const { t } = useI18n();
  return <div className="py-8 text-center">{t('post.loading')}</div>;
}

export default function PostPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PostPageContent />
    </Suspense>
  );
}
