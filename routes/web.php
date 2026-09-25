<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ExperimentController;
use App\Http\Controllers\Admin\MaterialController;
use App\Http\Controllers\Admin\ExperimentParameterController;
use App\Http\Controllers\Admin\QuestionController;
use App\Http\Controllers\ExperimentController as UserExperimentController;
use App\Http\Controllers\AttemptController;
use App\Http\Controllers\HistoryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified', 'not.blocked'])->name('dashboard');

Route::middleware(['auth', 'not.blocked', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('dashboard');

        Route::resource('categories', CategoryController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        Route::resource('experiments', ExperimentController::class)
            ->only(['index', 'show', 'store', 'update', 'destroy']);
        Route::patch('experiments/{experiment}/toggle', [ExperimentController::class, 'toggle'])
            ->name('experiments.toggle');

        Route::post('experiments/{experiment}/materials', [MaterialController::class, 'store'])
            ->name('materials.store');
        Route::put('materials/{material}', [MaterialController::class, 'update'])
            ->name('materials.update');
        Route::delete('materials/{material}', [MaterialController::class, 'destroy'])
            ->name('materials.destroy');

        Route::post('experiments/{experiment}/parameters', [ExperimentParameterController::class, 'store'])
            ->name('parameters.store');
        Route::put('parameters/{parameter}', [ExperimentParameterController::class, 'update'])
            ->name('parameters.update');
        Route::delete('parameters/{parameter}', [ExperimentParameterController::class, 'destroy'])
            ->name('parameters.destroy');

        Route::post('experiments/{experiment}/questions', [QuestionController::class, 'store'])
            ->name('questions.store');
        Route::put('questions/{question}', [QuestionController::class, 'update'])
            ->name('questions.update');
        Route::delete('questions/{question}', [QuestionController::class, 'destroy'])
            ->name('questions.destroy');
    });

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/experiments', [UserExperimentController::class, 'index'])->name('experiments.index');
    Route::get('/experiments/{experiment:slug}', [UserExperimentController::class, 'show'])->name('experiments.show');
    Route::post('/experiments/{experiment:slug}/simulate', [UserExperimentController::class, 'simulate'])->name('experiments.simulate');

    Route::post('/experiments/{experiment:slug}/attempts', [AttemptController::class, 'store'])
        ->name('attempts.store');
    Route::post('/attempts/{attempt}/results', [AttemptController::class, 'storeResult'])
        ->name('attempts.results.store');
    Route::patch('/attempts/{attempt}/finish', [AttemptController::class, 'finish'])
        ->name('attempts.finish');

    Route::get('/attempts/{attempt}/quiz', [AttemptController::class, 'quiz'])
        ->name('attempts.quiz');
    Route::post('/attempts/{attempt}/quiz', [AttemptController::class, 'submitQuiz'])
        ->name('attempts.quiz.store');

    Route::get('/history', [HistoryController::class, 'index'])->name('history.index');
    Route::get('/history/{attempt}', [HistoryController::class, 'show'])->name('history.show');
});

require __DIR__.'/auth.php';