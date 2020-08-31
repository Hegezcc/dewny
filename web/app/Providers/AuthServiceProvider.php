<?php

namespace App\Providers;

use App\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Gate::define('access', function (User $user, $model) {
            // Always allow access if user is admin
            if ($user->is_admin) {
                return true;
            }

            // If checked model is the current user
            if ($model instanceof User && $model->is($user)) {
                return true;
            }

            // If model belongs to current user (model must have user relationship defined)
            if (isset($model->user) && $model->user->is($user)) {
                return true;
            }

            return false;
        });
    }
}
