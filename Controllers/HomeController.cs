using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication.Models;

namespace WebApplication.Controllers
{
    [Route("api/[controller]")]
    public class HomeController : Controller
    {
        AppDB db;
        public HomeController()
        {
            db = new AppDB();
        }
        [HttpGet]
        public IEnumerable<MyUser> Get()
        {
            return db.MyUsers;
        }

        [HttpPost]
        public IActionResult Post(MyUser user)
        {
            user.Id = Guid.NewGuid().ToString();
            db.MyUsers.Add(user);
            db.SaveChanges();
            return Ok(user);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            MyUser user = db.MyUsers.FirstOrDefault(x => x.Id == id);
            if (user == null)
            {
                return NotFound();
            }
            db.MyUsers.Remove(user);
            db.SaveChanges();
            return Ok(user);
        }

        [HttpPut]
        public IActionResult Put(MyUser u)
        {
            MyUser user = db.MyUsers.FirstOrDefault(x => x.Id == u.Id);
            user.Name = u.Name;
            user.Email = u.Email;
            user.Password = u.Password;
            db.SaveChanges();
            return Ok(user);
        }
    }
}
