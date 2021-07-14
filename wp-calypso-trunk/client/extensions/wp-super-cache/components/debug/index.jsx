/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pick } from 'lodash';
import moment from 'moment';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { Button, Card } from '@automattic/components';
import ClipboardButtonInput from 'calypso/components/clipboard-button-input';
import FormButton from 'calypso/components/forms/form-button';
import FormFieldset from 'calypso/components/forms/form-fieldset';
import FormLabel from 'calypso/components/forms/form-label';
import FormSettingExplanation from 'calypso/components/forms/form-setting-explanation';
import FormTextInput from 'calypso/components/forms/form-text-input';
import SectionHeader from 'calypso/components/section-header';
import WrapSettingsForm from '../wrap-settings-form';

class DebugTab extends Component {
	static propTypes = {
		fields: PropTypes.object,
		translate: PropTypes.func.isRequired,
	};

	static defaultProps = {
		fields: {},
	};

	deleteLog = () => this.props.saveSettings( this.props.siteId, { wpsc_delete_log: true } );

	render() {
		const {
			fields: {
				cache_path,
				cache_path_url,
				wp_cache_debug_ip,
				wp_cache_debug_log = '',
				wp_super_cache_comments,
				wp_super_cache_debug,
				wp_cache_debug_username,
				wp_super_cache_front_page_check,
				wp_super_cache_front_page_clear,
				wp_super_cache_front_page_text,
				wp_super_cache_front_page_notification,
			},
			handleAutosavingToggle,
			handleChange,
			handleSubmitForm,
			isRequesting,
			isSaving,
			translate,
		} = this.props;

		return (
			<div className="wp-super-cache__debug-tab">
				<form>
					<SectionHeader label={ translate( 'Debug' ) }>
						<FormButton
							compact
							primary
							disabled={ isRequesting || isSaving }
							isSubmitting={ isSaving }
							onClick={ handleSubmitForm }
						/>
					</SectionHeader>
					<Card>
						<FormFieldset>
							<ToggleControl
								checked={ !! wp_super_cache_debug }
								disabled={ isRequesting || isSaving }
								onChange={ handleAutosavingToggle( 'wp_super_cache_debug' ) }
								label={ translate( 'Enable Debugging' ) }
							/>
						</FormFieldset>
						<div className="wp-super-cache__debug-fieldsets">
							<FormFieldset>
								<FormLabel htmlFor="debugLog">
									{ wp_super_cache_debug
										? translate( 'Currently logging to:' )
										: translate( 'Last logged to:' ) }
								</FormLabel>
								<FormTextInput disabled id="debugLog" value={ cache_path + wp_cache_debug_log } />
								<Button
									className="wp-super-cache__debug-log-button"
									compact
									disabled={ isRequesting || isSaving }
									href={ cache_path_url + wp_cache_debug_log }
									rel="noopener noreferrer"
									target="_blank"
								>
									{ translate( 'View debug log' ) }
								</Button>
								<Button
									className="wp-super-cache__debug-log-button"
									compact
									disabled={ isRequesting || isSaving }
									onClick={ this.deleteLog }
									scary
								>
									{ translate( 'Reset debug log' ) }
								</Button>
							</FormFieldset>
							<FormFieldset>
								<FormLabel htmlFor="username">{ translate( 'Username and Password:' ) }</FormLabel>
								<ClipboardButtonInput id="username" value={ wp_cache_debug_username } />
							</FormFieldset>
							<FormFieldset>
								<FormLabel htmlFor="ipAddress">{ translate( 'IP Address' ) }</FormLabel>
								<FormTextInput
									disabled={ isRequesting || isSaving || ! wp_super_cache_debug }
									id="ipAddress"
									onChange={ handleChange( 'wp_cache_debug_ip' ) }
									value={ wp_cache_debug_ip || '' }
								/>
								<FormSettingExplanation>
									{ translate( '(only log requests from this IP address)' ) }
								</FormSettingExplanation>
							</FormFieldset>
							<FormFieldset>
								<ToggleControl
									checked={ !! wp_super_cache_comments }
									disabled={ isRequesting || isSaving || ! wp_super_cache_debug }
									onChange={ handleAutosavingToggle( 'wp_super_cache_comments' ) }
									label={ translate( 'Cache Status Messages' ) }
								/>
								<FormSettingExplanation isIndented>
									{ translate( 'Display comments at the end of every page like this:' ) }
									<span className="wp-super-cache__debug-cache-comment-snippet">
										{ translate(
											'<!-- Dynamic page generated in 0.450 seconds. -->\n' +
												'<!-- Cached page generated by WP-Super-Cache on %(date)s -->\n' +
												'<!-- super cache -->',
											{
												args: {
													date: moment().utc().format( 'YYYY-MM-DD HH:mm:ss' ),
												},
											}
										) }
									</span>
								</FormSettingExplanation>
							</FormFieldset>
						</div>
					</Card>
				</form>

				<form>
					<SectionHeader label={ translate( 'Advanced' ) }>
						<FormButton
							compact
							primary
							disabled={ isRequesting || isSaving }
							isSubmitting={ isSaving }
							onClick={ handleSubmitForm }
						/>
					</SectionHeader>
					<Card>
						<FormFieldset>
							<ToggleControl
								checked={ !! wp_super_cache_front_page_check }
								disabled={ isRequesting || isSaving || ! wp_super_cache_debug }
								onChange={ handleAutosavingToggle( 'wp_super_cache_front_page_check' ) }
								label={ translate( 'Check front page every 5 minutes.' ) }
							/>
							<FormSettingExplanation isIndented>
								{ translate( " If there are errors you'll receive an email." ) }
							</FormSettingExplanation>
						</FormFieldset>
						<div className="wp-super-cache__debug-fieldsets">
							<FormFieldset>
								<FormLabel htmlFor="frontPageText">
									{ translate( 'Check text for automatic cache clearing' ) }
								</FormLabel>
								<FormTextInput
									disabled={
										isRequesting ||
										isSaving ||
										! wp_super_cache_debug ||
										! wp_super_cache_front_page_check
									}
									id="frontPageText"
									onChange={ handleChange( 'wp_super_cache_front_page_text' ) }
									value={ wp_super_cache_front_page_text || '' }
								/>
								<FormSettingExplanation>
									{ translate(
										"If the front page doesn't contain this text, the cache will be cleared automatically. " +
											'Leave this field blank to disable automatic cache clearing.'
									) }
								</FormSettingExplanation>
							</FormFieldset>
							<FormFieldset>
								<ToggleControl
									checked={ !! wp_super_cache_front_page_clear }
									disabled={
										isRequesting ||
										isSaving ||
										! wp_super_cache_debug ||
										! wp_super_cache_front_page_check
									}
									onChange={ handleAutosavingToggle( 'wp_super_cache_front_page_clear' ) }
									label={ translate( 'Clear cache on error.' ) }
								/>
								<ToggleControl
									checked={ !! wp_super_cache_front_page_notification }
									disabled={
										isRequesting ||
										isSaving ||
										! wp_super_cache_debug ||
										! wp_super_cache_front_page_check
									}
									onChange={ handleAutosavingToggle( 'wp_super_cache_front_page_notification' ) }
									label={ translate(
										'Email the blog admin when checks are made. (useful for testing)'
									) }
								/>
							</FormFieldset>
						</div>
					</Card>
				</form>
			</div>
		);
	}
}

const getFormSettings = ( settings ) => {
	return pick( settings, [
		'cache_path',
		'cache_path_url',
		'wp_cache_debug_ip',
		'wp_cache_debug_log',
		'wp_super_cache_comments',
		'wp_super_cache_debug',
		'wp_cache_debug_username',
		'wp_super_cache_front_page_check',
		'wp_super_cache_front_page_clear',
		'wp_super_cache_front_page_text',
		'wp_super_cache_front_page_notification',
	] );
};

export default WrapSettingsForm( getFormSettings )( DebugTab );