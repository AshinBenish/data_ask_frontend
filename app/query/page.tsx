'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Code, Play, Loader2, CheckCircle, Database, Save, AlertTriangle, Settings, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { questionList, SqlQueryResult } from '@/types/apiDataTypes';
import { getquestions, getSqlQuery, runSqlQuery } from '@/utils/queryApi';
import Cookies from 'js-cookie';

export default function QueryPage() {
	const router = useRouter();
	const [query, setQuery] = useState('');
	const [generatedSQL, setGeneratedSQL] = useState('');
	const [generating, setGenerating] = useState(false);
	const [running, setRunning] = useState(false);
	const [saving, setSaving] = useState(false);
	const [results, setResults] = useState<SqlQueryResult>();
	const [placeholders, setPlaceholders] = useState<string[]>([]);
	const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});
	const [finalSQL, setFinalSQL] = useState('');

	// Sample queries state
	const [sampleQueries, setSampleQueries] = useState<questionList[]>([]);
	const [loadingSamples, setLoadingSamples] = useState(true);
	const [samplesError, setSamplesError] = useState(false);

	useEffect(() => {
		// Check if we have a query to view from saved queries
		const viewQuery = sessionStorage.getItem('viewQuery');
		if (viewQuery) {
			const parsedQuery = JSON.parse(viewQuery);
			setQuery(parsedQuery.nlQuery || '');
			setGeneratedSQL(parsedQuery.sqlQuery || '');
			// Clear the session storage after using it
			sessionStorage.removeItem('viewQuery');
		}
	}, []);

	// Load sample queries from API
	useEffect(() => {
		loadSampleQueries();
	}, []);

	const loadSampleQueries = async () => {
		setLoadingSamples(true);
		setSamplesError(false);
		const token: string | undefined = Cookies.get('accessToken');
		const sessionId: string | undefined = Cookies.get('sessionId');
		try {
			// Simulate API call
			const response = await getquestions(token, sessionId);
			setSampleQueries(response.data);
			// Simulate random success/failure (90% success rate)
		} catch (error) {
			setSamplesError(true);
			toast.error('Failed to load sample queries');
		} finally {
			setLoadingSamples(false);
		}
	};

	// Function to detect placeholders in SQL
	const detectPlaceholders = (sql: string) => {
		const placeholderRegex = /\{([^}]+)\}/g;
		const matches: string[] = [];
		let match;

		while ((match = placeholderRegex.exec(sql)) !== null) {
			if (!matches.includes(match[1])) {
				matches.push(match[1]);
			}
		}
		return matches;
	};

	// Function to replace placeholders with values
	const replacePlaceholders = (sql: string, values: Record<string, string>) => {
		let finalSql = sql;
		Object.entries(values).forEach(([placeholder, value]) => {
			const regex = new RegExp(`\\{${placeholder}\\}`, 'g');
			finalSql = finalSql.replace(regex, value);
		});
		return finalSql;
	};

	useEffect(() => {
		if (generatedSQL) {
			const detectedPlaceholders = detectPlaceholders(generatedSQL);
			setPlaceholders(detectedPlaceholders);

			// Initialize placeholder values
			const initialValues: Record<string, string> = {};
			detectedPlaceholders.forEach(placeholder => {
				initialValues[placeholder] = placeholderValues[placeholder] || '';
			});
			setPlaceholderValues(initialValues);
		}
	}, [generatedSQL]);

	useEffect(() => {
		if (generatedSQL && placeholders.length > 0) {
			setFinalSQL(replacePlaceholders(generatedSQL, placeholderValues));
		} else {
			setFinalSQL(generatedSQL);
		}
	}, [generatedSQL, placeholderValues, placeholders]);

	const handleGenerateSQL = async () => {
		if (!query.trim()) return;

		setGenerating(true);
		const token: string | undefined = Cookies.get('accessToken');
		const sessionId: string | undefined = Cookies.get('sessionId');
		// Simulate SQL generation
		const response = await getSqlQuery(token, sessionId, query);
		const generatedSqlQuery = response.data;

		setGeneratedSQL(generatedSqlQuery);
		setGenerating(false);
	};

	const handlePlaceholderChange = (placeholder: string, value: any) => {
		setPlaceholderValues(prev => ({
			...prev,
			[placeholder]: value
		}));
	};

	const validatePlaceholders = () => {
		const emptyPlaceholders = placeholders.filter(placeholder =>
			!placeholderValues[placeholder] || placeholderValues[placeholder].trim() === ''
		);

		if (emptyPlaceholders.length > 0) {
			toast.error(`Please fill in all placeholders: ${emptyPlaceholders.join(', ')}`);
			return false;
		}

		return true;
	};

	const handleRunQuery = async () => {
		if (!finalSQL) return;

		// Validate placeholders if they exist
		if (placeholders.length > 0 && !validatePlaceholders()) {
			return;
		}

		setRunning(true);
		const toastId = toast.loading('Executing query...');
		const token: string | undefined = Cookies.get('accessToken');
		const sessionId: string | undefined = Cookies.get('sessionId');
		try {
			// Simulate API call
			const response = await runSqlQuery(token, sessionId, finalSQL);
			setResults(response.data);
			toast.success('Query executed successfully!', { id: toastId });
		} catch (error) {
			toast.error('Failed to load sample queries', { id: toastId });
		} finally {
			setRunning(false);
		}

	};

	const handleSaveQuery = async () => {
		if (!query.trim() || !generatedSQL) return;

		setSaving(true);

		// Simulate saving query
		await new Promise(resolve => setTimeout(resolve, 1500));

		setSaving(false);
		toast.success('Query saved successfully!');

		// Navigate to saved queries page
		router.push('/saved-queries');
	};

	const handleViewResults = () => {
		// Store query data for result page
		sessionStorage.setItem('selectedQuery', JSON.stringify({
			title: `Query: ${query.substring(0, 50)}...`,
			nlQuery: query,
			sqlQuery: finalSQL,
			executionTime: '0.45s',
			resultRows: results?.data.length || 0,
		}));

		router.push('/result');
	};

	const getPlaceholderType = (placeholder: string) => {
		const lowerPlaceholder = placeholder.toLowerCase();
		if (lowerPlaceholder.includes('date')) return 'date';
		if (lowerPlaceholder.includes('price') || lowerPlaceholder.includes('amount') || lowerPlaceholder.includes('count') || lowerPlaceholder.includes('limit')) return 'number';
		return 'text';
	};

	const getPlaceholderPlaceholder = (placeholder: string) => {
		const lowerPlaceholder = placeholder.toLowerCase();
		if (lowerPlaceholder.includes('date')) return 'YYYY-MM-DD';
		if (lowerPlaceholder.includes('price')) return 'e.g., 100.00';
		if (lowerPlaceholder.includes('amount')) return 'e.g., 100.00';
		if (lowerPlaceholder.includes('count') || lowerPlaceholder.includes('limit')) return 'e.g., 10';
		if (lowerPlaceholder.includes('id')) return 'e.g., 123';
		if (lowerPlaceholder.includes('status')) return 'e.g., active';
		return `Enter ${placeholder}`;
	};

	return (
		<div className="space-y-6 animate-in fade-in duration-500">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Natural Language Query</h1>
				<p className="mt-2 text-gray-600">
					Ask questions in plain English and get SQL queries automatically generated.
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Query Input */}
				<div className="lg:col-span-2 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<MessageSquare className="h-5 w-5 mr-2 text-amber-500" />
								Ask Your Question
							</CardTitle>
							<CardDescription>
								Type your question in natural language
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Textarea
								placeholder="e.g., Show me the top 5 customers by order value..."
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								className="min-h-[100px] resize-none"
							/>

							<Button
								onClick={handleGenerateSQL}
								disabled={!query.trim() || generating}
								className="w-full bg-amber-500 hover:bg-amber-600"
							>
								{generating ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Generating SQL...
									</>
								) : (
									<>
										<Code className="h-4 w-4 mr-2" />
										Generate SQL
									</>
								)}
							</Button>
						</CardContent>
					</Card>

					{/* Generated SQL */}
					{(generatedSQL || generating) && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									<div className="flex items-center">
										<Code className="h-5 w-5 mr-2 text-amber-500" />
										Generated SQL
										{placeholders.length > 0 && (
											<Badge variant="outline" className="ml-2 text-amber-600 border-amber-200">
												<Settings className="h-3 w-3 mr-1" />
												{placeholders.length} placeholder{placeholders.length > 1 ? 's' : ''}
											</Badge>
										)}
									</div>
									{generatedSQL && !generating && (
										<Button
											variant="outline"
											size="sm"
											onClick={handleSaveQuery}
											disabled={saving}
										>
											{saving ? (
												<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											) : (
												<Save className="h-4 w-4 mr-2" />
											)}
											Save Query
										</Button>
									)}
								</CardTitle>
								<CardDescription>
									Review and run the generated query
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{generating ? (
									<div className="flex items-center justify-center py-8">
										<div className="text-center space-y-2">
											<Loader2 className="h-8 w-8 text-amber-500 mx-auto animate-spin" />
											<p className="text-amber-600 font-medium">Processing your question...</p>
										</div>
									</div>
								) : (
									<>
										<pre className="bg-gray-50 p-4 rounded-lg text-sm font-mono overflow-x-auto border">
											{generatedSQL}
										</pre>

										{/* Placeholder Input Section */}
										{placeholders.length > 0 && (
											<div className="space-y-4">
												<Alert className="border-amber-200 bg-amber-50">
													<AlertTriangle className="h-4 w-4 text-amber-600" />
													<AlertDescription className="text-amber-800">
														This query contains placeholders that need values before execution.
													</AlertDescription>
												</Alert>

												<Card className="border-amber-200">
													<CardHeader className="pb-3">
														<CardTitle className="text-lg flex items-center">
															<Settings className="h-5 w-5 mr-2 text-amber-500" />
															Configure Placeholders
														</CardTitle>
														<CardDescription>
															Provide values for the placeholders in your query
														</CardDescription>
													</CardHeader>
													<CardContent className="space-y-4">
														{placeholders.map((placeholder, index) => (
															<div
																key={placeholder}
																className="space-y-2 animate-in slide-in-from-left-4"
																style={{ animationDelay: `${index * 100}ms` }}
															>
																<Label htmlFor={placeholder} className="text-sm font-medium">
																	{placeholder}
																	<Badge variant="secondary" className="ml-2 text-xs">
																		{getPlaceholderType(placeholder)}
																	</Badge>
																</Label>
																<Input
																	id={placeholder}
																	type={getPlaceholderType(placeholder)}
																	placeholder={getPlaceholderPlaceholder(placeholder)}
																	value={placeholderValues[placeholder] || ''}
																	onChange={(e) => handlePlaceholderChange(placeholder, e.target.value)}
																	className="focus:border-amber-500 focus:ring-amber-500"
																/>
															</div>
														))}
													</CardContent>
												</Card>

												{/* Final SQL Preview */}
												{Object.values(placeholderValues).some(value => value.trim() !== '') && (
													<div className="space-y-2">
														<Label className="text-sm font-medium text-gray-700">
															Final SQL (with placeholder values):
														</Label>
														<pre className="bg-green-50 p-4 rounded-lg text-sm font-mono overflow-x-auto border border-green-200">
															{finalSQL}
														</pre>
													</div>
												)}
											</div>
										)}

										<Button
											onClick={handleRunQuery}
											disabled={running || (placeholders.length > 0 && Object.values(placeholderValues).some(value => !value.trim()))}
											className="w-full bg-green-600 hover:bg-green-700"
										>
											{running ? (
												<>
													<Loader2 className="h-4 w-4 mr-2 animate-spin" />
													Running Query...
												</>
											) : (
												<>
													<Play className="h-4 w-4 mr-2" />
													Run Query
													{placeholders.length > 0 && (
														<Badge variant="secondary" className="ml-2">
															with {placeholders.length} value{placeholders.length > 1 ? 's' : ''}
														</Badge>
													)}
												</>
											)}
										</Button>
									</>
								)}
							</CardContent>
						</Card>
					)}

					{/* Results */}
					{(results || running) && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									<div className="flex items-center">
										<Database className="h-5 w-5 mr-2 text-amber-500" />
										Query Results
									</div>
									{results && !running && (
										<Button
											variant="outline"
											size="sm"
											onClick={handleViewResults}
										>
											View Full Results
										</Button>
									)}
								</CardTitle>
								<CardDescription>
									{running ? 'Executing query...' : `${results?.data.length || 0} rows returned`}
								</CardDescription>
							</CardHeader>
							<CardContent>
								{running ? (
									<div className="flex items-center justify-center py-8">
										<div className="text-center space-y-2">
											<Loader2 className="h-8 w-8 text-amber-500 mx-auto animate-spin" />
											<p className="text-amber-600 font-medium">Executing query...</p>
										</div>
									</div>
								) : (
									<div className="overflow-x-auto">
										<table className="w-full text-sm">
											<thead>
												<tr className="border-b">
													{results?.columns.map((row, index) => (
														<th key={index} className="text-left py-2 px-4">
															{row}
														</th>
													))}
												</tr>
											</thead>
											<tbody>
												{results?.data.map((row, index) => (
													<tr key={index} className="border-b hover:bg-gray-50">
														{results?.columns.map((coumName, subindex) => (
															<td key={subindex} className="py-2 px-4">
																{row[coumName]}
															</td>
														))}
													</tr>
												))}
												{results?.data.length === 0 && (
													<tr className="border-b">
														<td colSpan={results?.columns.length} className="py-2 px-4 text-center">
															No results found
														</td>
													</tr>
												)}
											</tbody>
										</table>
									</div>
								)}
							</CardContent>
						</Card>
					)}
				</div>

				{/* Sample Queries */}
				<Card className="h-fit">
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<span>Sample Queries</span>
							{samplesError && (
								<Button
									variant="ghost"
									size="sm"
									onClick={loadSampleQueries}
									className="text-amber-600 hover:text-amber-700"
								>
									<RefreshCw className="h-4 w-4" />
								</Button>
							)}
						</CardTitle>
						<CardDescription>
							{loadingSamples
								? 'Loading sample queries...'
								: samplesError
									? 'Failed to load queries'
									: 'Try these example questions'
							}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{loadingSamples ? (
							// Loading skeleton
							<div className="space-y-3">
								{[...Array(6)].map((_, index) => (
									<div
										key={index}
										className="animate-in fade-in duration-500"
										style={{ animationDelay: `${index * 100}ms` }}
									>
										<Skeleton className="h-12 w-full rounded-lg" />
									</div>
								))}
								<div className="pt-4 border-t">
									<Skeleton className="h-8 w-full rounded-lg" />
								</div>
							</div>
						) : samplesError ? (
							// Error state
							<div className="text-center py-8 space-y-3">
								<div className="text-gray-400">
									<AlertTriangle className="h-8 w-8 mx-auto mb-2" />
									<p className="text-sm">Failed to load sample queries</p>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={loadSampleQueries}
									className="text-amber-600 border-amber-200 hover:bg-amber-50"
								>
									<RefreshCw className="h-4 w-4 mr-2" />
									Try Again
								</Button>
							</div>
						) : (
							// Loaded state
							<>
								{sampleQueries.map((sample, index) => (
									<button
										key={index}
										onClick={() => setQuery(sample.question)}
										className="w-full text-left p-3 rounded-lg border hover:border-amber-200 hover:bg-amber-50 transition-all duration-200 text-sm animate-in slide-in-from-bottom-2"
										style={{ animationDelay: `${index * 50}ms` }}
									>
										{sample.question}
									</button>
								))}

								<div className="pt-4 border-t animate-in fade-in duration-500" style={{ animationDelay: '400ms' }}>
									<Badge variant="outline" className="w-full justify-center py-2">
										<CheckCircle className="h-3 w-3 mr-1" />
										AI-Powered
									</Badge>
								</div>
							</>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}